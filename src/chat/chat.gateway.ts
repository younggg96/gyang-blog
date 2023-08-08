import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService, private msg: MessageService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    await this.prisma.user.update({
      where: { id: +userId },
      data: { online: true },
    });
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    await this.prisma.user.update({
      where: { id: +userId },
      data: { online: false },
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { senderId: number; conversationId: number; content: string },
  ): Promise<void> {
    const { senderId, conversationId, content } = payload;
    const newMsg = await this.msg.createMessage({
      content,
      senderId: +senderId,
      conversationId: +conversationId,
    });
    this.server.emit('message', newMsg);
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
