import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { expireTimeOneDay } from '../../common/variables/constVariable';
import { SocketClient } from './socket.class';
import { WsException } from '@nestjs/websockets';
import { RoomService } from '../room/room.service';
import {
  GAME_DRAWER_IS_OUT,
  GAME_NEW_TURN,
  GAME_NEW_TURN_CHANNEL,
  PARTICIPANTS_CHANNEL,
  QUALIFY_TO_START_CHANNEL,
} from './constant';
import { RoomInterface } from '../room/room.interface';
import { Room } from '../room/room.entity';
import { UserService } from '../user/user.service';
import { RoomRound } from '../room-round/roomRound.entity';
import { errorsSocket } from 'src/common/errors/errorCode';
import { RoomRoundService } from '../room-round/roomRound.service';

@Injectable()
export class SocketService {
  constructor(
    private redisService: RedisService,
    private logger: Logger = new Logger(SocketService.name),
    private jwtService: JwtService,
    private configService: ConfigService,
    private roomService: RoomService,
    private roomRoundService: RoomRoundService,
    private userService: UserService,
  ) {}
  private stopProgress = false;
  public setProgressInterval(
    minProgressPercentage: number,
    percentageDescreasePerStep: number,
    timeStep: number,
    cb: (progress: number) => void,
  ) {
    this.stopProgress = false;
    let progress = 100;
    const progressInterval = setInterval(() => {
      if (this.stopProgress || progress <= minProgressPercentage) {
        clearInterval(progressInterval);
        return;
      }
      progress = progress - percentageDescreasePerStep;
      cb(progress);
    }, timeStep);
  }
  
  clearProgressInterval() {
    this.stopProgress = true;
  }

  async storeClientConnection(client: Socket) {
    try {
      const payload = await this.extractPayload(client);
      const idUser: number = payload.id;

      this.logger.log(`Client ${client.id} connected!`);
      const token = this.getTokenFromSocket(client);

      await this.redisService.setObjectByKeyValue(`${client.id}:ACCESSTOKEN`, token, expireTimeOneDay);
      return await this.redisService.setObjectByKeyValue(`USER:${idUser}:SOCKET`, client.id, expireTimeOneDay);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async checkTokenValidSocket(client: Socket): Promise<boolean> {
    const userId = this.getUserIdFromSocket(client);
    const tokenOfSocket: string = await this.getTokenFromSocket(client);
    const validToken: string = await this.redisService.getObjectByKey(
      `USER:${userId}:ACCESSTOKEN`,
    );

    return tokenOfSocket === validToken ? true : false;
  }

  async removeClientDisconnection(client: SocketClient) {
    try {
      const payload = await this.extractPayload(client);
      const idUser: number = payload.id;

      this.logger.log(`Client ${client.id} disconnected!`);

      await this.redisService.deleteObjectByKey(`USER:${idUser}:ROOM`);
      await this.redisService.deleteObjectByKey(`USER:${idUser}:SOCKET`);
      await this.redisService.deleteObjectByKey(`USER:${idUser}:ACCESSTOKEN`);
      await this.redisService.deleteObjectByKey(`${client.id}:ACCESSTOKEN`);
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

    if (!userId) {
      throw new WsException('Unauthorize socket!');
    }

    return Number.parseInt(userId);
  }

  async checkInBlockList(client: Socket): Promise<boolean> {
    const check: string = await this.redisService.getObjectByKey(
      `BLOCKLIST:SOCKET:${client.id}`,
    );

    return check ? true : false;
  }

  async checkLoginMultipleTab(client: Socket): Promise<boolean> {
    const userId = this.getUserIdFromSocket(client)
    const isGuest = await this.userService.isGuest(userId);

    if(isGuest) {
      return false;
    }
    
    const socketId: string = await this.redisService.getObjectByKey(`USER:${userId}:SOCKET`);

    if (socketId && socketId !== client.id) {
      return true;
    }

    return false;
  }

  sendError(client: Socket, error: ErrorSocket) {
    client.emit('error', error);
  }

  async checkAndEmitToHostRoom(server: Server, room: RoomInterface) {
    const isQualified = await this.roomService.qualifiedToStart(room.code_room);

    const hostRoomSocketId = await this.redisService.getObjectByKey(
      `USER:${room.host_id}:SOCKET`,
    );

    server.to(hostRoomSocketId).emit(QUALIFY_TO_START_CHANNEL, isQualified);
  }

  async sendListParticipantsInRoom(server: Server, room: Room) {
    const [participants, roomRound] = await Promise.all([
      this.roomService.getPartipantsInRoom(room),
      this.roomRoundService.getRoundOfRoom(room.id),
    ]);
    server.in(room.code_room).emit(PARTICIPANTS_CHANNEL, {
      participants,
      max_player: room.max_player,
      roomRound,
    });
  }

  async updateRoomRoundWhenDrawerOut(
    server: Server,
    codeRoom: string,
    roomRound: RoomRound,
  ) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);
    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);
    server.in(codeRoom).emit(GAME_NEW_TURN_CHANNEL, roomRound);
    server.in(codeRoom).emit(GAME_DRAWER_IS_OUT);
    await this.roomService.updateRoomStatus(room, GAME_NEW_TURN);
  }
}
