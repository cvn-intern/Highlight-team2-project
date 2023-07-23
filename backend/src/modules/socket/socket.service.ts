import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { expireTimeOneDay } from '../../common/variables/constVariable';
import { SocketClass } from './socket.class';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketService {
  constructor(
    private redisService: RedisService,
    private logger: Logger = new Logger(SocketService.name),
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async storeClientConnection(client: Socket) {
    try {
      const payload = await this.extractPayload(client);
      const idUser: number = payload.id;

      this.logger.log(`Client ${client.id} connected!`);
      const token = await this.redisService.getObjectByKey(`USER:${idUser}:ACCESSTOKEN`);
      await this.redisService.setObjectByKeyValue(`${client.id}:ACCESSTOKEN`, token, expireTimeOneDay);
      
      return await this.redisService.setObjectByKeyValue(`USER:${idUser}:SOCKET`, client.id, expireTimeOneDay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async checkTokenValidSocket(client: Socket): Promise<boolean> {
    const userId = this.getUserIdFromSocket(client)
    const tokenOfSocket: string = await this.getTokenFromSocket(client);
    const validToken: string =await this.redisService.getObjectByKey(`USER:${userId}:ACCESSTOKEN`);

    return tokenOfSocket === validToken ? true : false;
  }

  async removeClientDisconnection(client: SocketClass) {
    try {
      const payload = await this.extractPayload(client);
      const idUser: number = payload.id;

      this.logger.log(`Client ${client.id} disconnected!`);

      return await this.redisService.deleteObjectByKey(`USER:${idUser}:SOCKET`);
    } catch (error) {
      this.logger.error(error);
    }
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

  async getTokenFromSocket(client: Socket): Promise<string> {
    const token: string = client.handshake.headers.authorization;

    return token;
  }

  getUserIdFromSocket(client: Socket): number {
    const userId = client.handshake.headers.user as string;

    if(!userId) {
      throw new WsException('Unauthorize socket!');
    }

    return Number.parseInt(userId);
  }

  async checkInBlockList(client: Socket): Promise<boolean> {
    const check: string = await this.redisService.getObjectByKey(`BLOCKLIST:SOCKET:${client.id}`);

    return check ? true : false;
  }
}
