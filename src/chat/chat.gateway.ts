import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  usersMap: Map<string, Socket> = new Map();

  constructor(private prisma: PrismaService) {}
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.usersMap.set(userId.toString(), client);
      this.prisma.user.update({
        where: { id: +userId },
        data: { online: true },
      });
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.prisma.user.update({
        where: { id: +userId },
        data: { online: false },
      });
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { senderId: number; conversationId: number; content: string },
  ): Promise<void> {
    const { senderId, conversationId, content } = payload;
    console.log(payload);
    await this.prisma.message.create({
      data: {
        content,
        sender: { connect: { id: +senderId } },
        conversation: { connect: { id: +conversationId } },
      },
    });
    this.server.to(`conversation_${conversationId}`).emit('message', { senderId, content });
  }

  @SubscribeMessage('joinConversation')
  async handleJoinConversation(client: Socket, conversationId: number) {
    // 将客户端加入对话的房间
    client.join(`conversation_${conversationId}`);
  }

  @SubscribeMessage('leaveConversation')
  async handleLeaveConversation(client: Socket, conversationId: number) {
    // 将客户端离开对话的房间
    client.leave(`conversation_${conversationId}`);
  }
}
