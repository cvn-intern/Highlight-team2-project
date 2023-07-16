import { Logger, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { SocketGateway } from './gateways/socket.gateway';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './gateways/chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DrawGateway } from './gateways/draw.gateway';
import { RoomUserModule } from '../room-user/roomUser.module';
import { RoomUser } from '../room-user/roomUser.entity';
import { RoomUserService } from '../room-user/roomUser.service';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [
    RedisModule,
    JwtModule,
    ConfigModule,
    UserModule,
    RedisModule,
    RoomUserModule,
    RoomModule,
    TypeOrmModule.forFeature([RoomUser])
  ],
  controllers: [],
  providers: [SocketGateway, SocketService, Logger, DrawGateway, ChatGateway, RoomUserService],
  exports: [SocketService],
})
export class SocketModule {}
