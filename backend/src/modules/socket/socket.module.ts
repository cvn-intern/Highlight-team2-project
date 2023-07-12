import { Logger, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SocketGateway } from './gateways/socket.gateway';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  imports: [
    RedisModule,
    JwtModule,
    ConfigModule,
    UserModule,
  ],
  controllers: [],
  providers: [SocketGateway, SocketService, Logger, ChatGateway],
  exports: [SocketService],
})
export class SocketModule {}
