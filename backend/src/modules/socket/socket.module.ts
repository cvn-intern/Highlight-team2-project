import { Logger, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './gateways/socket.gateway';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { DrawGateway } from './gateways/draw.gateway';

@Module({
  imports: [
    RedisModule,
    JwtModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [SocketGateway, SocketService, Logger, DrawGateway],
  exports: [SocketService],
})
export class SocketModule {}
