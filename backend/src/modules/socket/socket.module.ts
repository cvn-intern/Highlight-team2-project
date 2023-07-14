import { Logger, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SocketGateway } from './gateways/socket.gateway';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './gateways/chat.gateway';
import { RoomUserModule } from '../roomUser/roomUser.module';
import { RoomUserService } from '../roomUser/roomUser.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomUser } from '../roomUser/roomUser.entity';
import { DrawGateway } from './gateways/draw.gateway';

@Module({
  imports: [
    RedisModule,
    JwtModule,
    ConfigModule,
    UserModule,
    RedisModule,
    RoomUserModule,
    TypeOrmModule.forFeature([RoomUser])
  ],
  controllers: [],
  providers: [SocketGateway, SocketService, Logger, DrawGateway, ChatGateway, RoomUserService],
  exports: [SocketService],
})
export class SocketModule {}
