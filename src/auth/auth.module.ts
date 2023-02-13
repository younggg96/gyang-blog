import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config/dist';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ProfileService } from 'src/profile/profile.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('app.token_access'),
          signOptions: { expiresIn: '100d' },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, ProfileService],
  controllers: [AuthController],
})
export class AuthModule {}
