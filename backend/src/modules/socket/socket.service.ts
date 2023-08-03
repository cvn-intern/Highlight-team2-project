import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { expireTimeOneDay } from '../../common/variables/constVariable';
import { WsException } from '@nestjs/websockets';
import { RoomService } from '../room/room.service';
import {
  GAME_DRAWER_IS_OUT,
  GAME_NEW_TURN,
  GAME_NEW_TURN_CHANNEL,
  GAME_NEXT_DRAWER_IS_OUT,
  PARTICIPANTS_CHANNEL,
  QUALIFY_TO_START_CHANNEL,
} from './constant';
import { RoomInterface } from '../room/room.interface';
import { Room } from '../room/room.entity';
import { UserService } from '../user/user.service';
import { RoomRound } from '../room-round/roomRound.entity';
import { errorsSocket } from 'src/common/errors/errorCode';
import { RoomRoundService } from '../room-round/roomRound.service';
import { RoomUserService } from '../room-user/roomUser.service';

@Injectable()
export class SocketService {
  constructor(
    private redisService: RedisService,
    private logger: Logger = new Logger(SocketService.name),
    private jwtService: JwtService,
    private configService: ConfigService,
    private roomService: RoomService,
    private roomRoundService: RoomRoundService,
    private roomUserService: RoomUserService,
    private userService: UserService,
  ) {}
  async storeClientConnection(client: Socket) {
    try {
      const payload = await this.extractPayload(client);
      const idUser: number = payload.id;

      this.logger.log(`Client ${client.id} connected!`);
      const token = this.getTokenFromSocket(client);

      return await Promise.all([
        this.redisService.setObjectByKeyValue(`${client.id}:ACCESSTOKEN`, token, expireTimeOneDay),
        this.redisService.setObjectByKeyValue(`USER:${idUser}:SOCKET`, client.id, expireTimeOneDay),
        this.redisService.setObjectByKeyValue(`USER:${idUser}:ACCESSTOKEN`, token, expireTimeOneDay),
      ]);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async checkTokenValidSocket(client: Socket): Promise<boolean> {
    const userId = this.getUserIdFromSocket(client);
    const tokenOfSocket: string = await this.getTokenFromSocket(client);
    const validToken: string = await this.redisService.getObjectByKey(`USER:${userId}:ACCESSTOKEN`);

    return tokenOfSocket === validToken ? true : false;
  }

  async removeClientDisconnection(userId: number) {
    try {
      const socketId = await this.redisService.getObjectByKey(`USER:${userId}:SOCKET`);
      this.logger.log(`Client ${socketId} disconnected!`);

      await this.redisService.deleteObjectByKey(`${socketId}:ACCESSTOKEN`);
      await this.redisService.deleteObjectByKey(`USER:${userId}:ROOM`);
      await this.redisService.deleteObjectByKey(`USER:${userId}:SOCKET`);
      await this.redisService.deleteObjectByKey(`USER:${userId}:ACCESSTOKEN`);
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

  getTokenFromSocket(client: Socket): string {
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
    const check: string = await this.redisService.getObjectByKey(`BLOCKLIST:SOCKET:${client.id}`);

    return check ? true : false;
  }

  async checkLoginMultipleTab(client: Socket): Promise<boolean> {
    const userId = this.getUserIdFromSocket(client);
    const isGuest = await this.userService.isGuest(userId);

    if (isGuest) {
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

    const hostRoomSocketId = await this.redisService.getObjectByKey(`USER:${room.host_id}:SOCKET`);

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

  async updateRoomRoundWhenDrawerOut(server: Server, codeRoom: string, roomRound: RoomRound, type: string) {
    const room = await this.roomService.getRoomByCodeRoom(codeRoom);
    if (!room) throw new WsException(errorsSocket.ROOM_NOT_FOUND);

    switch (type) {
      case GAME_DRAWER_IS_OUT:
        server.in(codeRoom).emit(GAME_DRAWER_IS_OUT);
        break;
      case GAME_NEXT_DRAWER_IS_OUT:
        server.in(codeRoom).emit(GAME_NEXT_DRAWER_IS_OUT);
        break;
      default:
        break;
    }
    server.in(codeRoom).emit(GAME_NEW_TURN_CHANNEL, roomRound);
    await this.roomService.updateRoomStatus(room, GAME_NEW_TURN);
  }

  async handlePainterOrNextPainterOutRoom(oldRoomRound: RoomRound, userId: number, server: Server, room: Room) {
    if (oldRoomRound.next_painter === userId) {
      await this.roomUserService.resetNextPainterCachePainterForRoom(room.id);
    }

    if (oldRoomRound.painter === userId || oldRoomRound.next_painter === userId) {
      const { endedAt, painterRound, startedAt, word } = await this.roomRoundService.initRoundInfomation(room);

      const newRoomRound = await this.roomRoundService.updateRoomRound({
        ...oldRoomRound,
        word,
        current_round: oldRoomRound.current_round - 1,
        ended_at: endedAt,
        started_at: startedAt,
        painter: painterRound.painter,
        next_painter: painterRound.next_painter,
      });

      await this.updateRoomRoundWhenDrawerOut(
        server,
        room.code_room,
        newRoomRound,
        oldRoomRound.painter === userId ? GAME_DRAWER_IS_OUT : GAME_NEXT_DRAWER_IS_OUT,
      );
      await this.sendListParticipantsInRoom(server, room);
    }
  }
}
