import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { expireTimeOneDay } from 'src/common/variables/constVariable';

@Injectable()
export class SocketService {
  constructor(
    private redisService: RedisService,
    private logger: Logger = new Logger(SocketService.name),
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async storeClientConnection(client: Socket) {
    const payload = await this.extractPayload(client);
    const idUser: number = payload.id;

    return await this.redisService.setObjectByKeyValue(`USER:${idUser}:SOCKET`, client.id, expireTimeOneDay)
  }

  async removeClientDisconnection(client: Socket) {
    const payload = await this.extractPayload(client);
    const idUser: number = payload.id;
    
    return await this.redisService.deleteObjectByKey(`USER:${idUser}:SOCKET`);
  }

  async extractPayload(socket: Socket): Promise<any> {
    try {
      const token: string = socket.handshake.headers.authorization;
     
      return await this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESSKEY'),
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
