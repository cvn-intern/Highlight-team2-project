import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { Room } from 'src/modules/room/room.entity';
import { LEAVE_ROOM_CONTENT, LEAVE_ROOM_TYPE } from '../constant';
import { Socket } from 'socket.io';
import { expireTimeOneDay } from 'src/common/variables/constVariable';
import { errorsSocket } from 'src/common/errors/errorCode';
const moment = require('moment');

export class JoinGateway extends SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const isBlock = await this.socketService.checkInBlockList(client);
      if (isBlock) {
        return;
      }

      const payload = await this.socketService.extractPayload(client);
      if (!payload) {
        this.logger.warn(`${client.id} invalid credential!`);
        return;
      }

      const user = await this.userService.getUserById(payload.id);
      if (!user) {
        this.socketService.sendError(client, errorsSocket.USER_NOT_FOUND);
        return;
      }

      const codeRoom: string = await this.redisService.getObjectByKey(`USER:${user.id}:ROOM`);

      if (!codeRoom) {
        await this.socketService.removeClientDisconnection(user.id);
        return;
      }

      let room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);
      if (!room) {
        this.socketService.sendError(client, errorsSocket.ROOM_NOT_FOUND);
        return;
      }

      client.leave(room.code_room);

      const ROOM_LEAVE = `${room.code_room}-leave`;
      this.server.in(codeRoom).emit(ROOM_LEAVE, {
        user: user.nickname,
        type: LEAVE_ROOM_TYPE,
        message: LEAVE_ROOM_CONTENT,
      });

      await this.roomUserService.deleteRoomUser(room.id, user.id);
      await this.socketService.removeClientDisconnection(user.id);

      if (user.id === room.host_id) {
        room = await this.roomService.changeHost(room.code_room);
      }

      await this.socketService.sendListParticipantsInRoom(this.server, room);

      const roomRound = await this.roomRoundService.getRoundOfRoom(room.id);
      if (!roomRound) return;

      const participants = await this.roomUserService.getListUserOfRoom(room);
      if (participants.length === 1) {
        await this.roomRoundService.deleteRoomRound(room.id);
        return;
      }

      await this.socketService.handlePainterOrNextPainterOutRoom(roomRound, user.id, this.server, room);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const isMultipleTab = await this.socketService.checkLoginMultipleTab(client);

      if (isMultipleTab) {
        await this.redisService.setObjectByKeyValue(`BLOCKLIST:SOCKET:${client.id}`, client.id, expireTimeOneDay * 365);
        this.socketService.sendError(client, errorsSocket.MULTIPLE_TAB);
        return;
      }

      this.socketService.storeClientConnection(client);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
