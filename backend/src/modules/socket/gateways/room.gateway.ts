import { ConnectedSocket, MessageBody, SubscribeMessage, WsException } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import {
  BLOCK_MESSAGE,
  GAME_STATUS,
  HOST_KICK_USER_CONTENT,
  JOIN_ROOM_CHANNEL,
  JOIN_ROOM_CONTENT,
  JOIN_ROOM_TYPE,
  KICK_CHANNEL,
  LEAVE_ROOM_CHANNEL,
  LEAVE_ROOM_CONTENT,
  LEAVE_ROOM_TYPE,
  NOTIFY_CHANNEL,
} from '../constant';
import { SocketClient } from '../socket.class';
import { errorsSocket } from 'src/common/errors/errorCode';
import { Room } from 'src/modules/room/room.entity';
import { Socket } from 'socket.io';
import { Chat } from '../types/chat';
import { expireTimeOneDay } from 'src/common/variables/constVariable';

type KickUser = {
  codeRoom: string;
  userId: number;
  nickname: string;
};

export class RoomGateway extends SocketGateway {
  @SubscribeMessage(JOIN_ROOM_CHANNEL)
  async handleJoinRoom(@MessageBody() codeRoom: string, @ConnectedSocket() client: SocketClient) {
    try {
      let room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);

      if (!room) {
        this.socketService.sendError(client, errorsSocket.ROOM_NOT_FOUND);
        throw new WsException(errorsSocket.ROOM_NOT_FOUND);
      }

      const isAvailableRoom: boolean = await this.roomService.checkRoomAvailability(room.code_room);

      if (!isAvailableRoom) {
        this.socketService.sendError(client, errorsSocket.ROOM_FULL);
        throw new WsException(errorsSocket.ROOM_FULL);
      }

      const participant = await this.roomService.joinRoom(room.id, client.user.id);

      if (!participant) {
        this.socketService.sendError(client, errorsSocket.CAN_NOT_JOIN);
        throw new WsException(errorsSocket.CAN_NOT_JOIN);
      }

      client.join(room.code_room);
      await this.redisService.setObjectByKeyValue(`USER:${client.user.id}:ROOM`, codeRoom, expireTimeOneDay);

      const messageContent: Chat = {
        socketId: client.id,
        user: client.user.nickname,
        type: JOIN_ROOM_TYPE,
        message: JOIN_ROOM_CONTENT,
      };
      this.server.in(codeRoom).emit(codeRoom, messageContent);

      room = await this.roomService.changeHost(room.code_room);

      await this.redisService.setObjectByKeyValue(`USER:${client.user.id}:ROOM`, room.code_room, expireTimeOneDay);
      const roomStatus = this.roomService.getRoomStatus(room);
      this.server.to(client.id).emit(GAME_STATUS, roomStatus);

      await this.socketService.sendListParticipantsInRoom(this.server, room);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage(KICK_CHANNEL)
  async hanldeKick(@MessageBody() data: KickUser, @ConnectedSocket() client: SocketClient) {
    const room: Room = await this.roomService.getRoomByCodeRoom(data.codeRoom);

    if (!room) {
      throw new WsException(errorsSocket.ROOM_NOT_FOUND);
    }

    if (room.host_id !== client.user.id) {
      throw new WsException(errorsSocket.YOU_NOT_HOST);
    }
    const socketIdKickedUser = await this.redisService.getObjectByKey(`USER:${data.userId}:SOCKET`);
    const socketKickedUser: Socket = this.server.sockets.sockets.get(socketIdKickedUser);

    socketKickedUser.leave(room.code_room);
    const messageContent: Chat = {
      user: data.nickname,
      type: BLOCK_MESSAGE,
      message: HOST_KICK_USER_CONTENT,
    };
    socketKickedUser.to(room.code_room).emit(`${room.code_room}-leave`, messageContent);
    this.server.to(socketIdKickedUser).emit(NOTIFY_CHANNEL, `You ${HOST_KICK_USER_CONTENT}`);

    await this.roomUserService.deleteRoomUser(room.id, data.userId);
    await this.redisService.deleteObjectByKey(`USER:${data.userId}:ROOM`);
    await this.socketService.checkAndEmitToHostRoom(this.server, room);

    await this.socketService.sendListParticipantsInRoom(this.server, room);

    const roomRound = await this.roomRoundService.getRoundOfRoom(room.id);
    if (!roomRound) return;

    const participants = await this.roomUserService.getListUserOfRoom(room);
    if (participants.length === 1) {
      await this.roomRoundService.deleteRoomRound(room.id);
      this.server.in(room.code_room).emit('reset-game');
    } else {
      await this.socketService.handlePainterOrNextPainterOutRoom(roomRound, client.user.id, this.server, room);
    }

    await this.socketService.sendListParticipantsInRoom(this.server, room);
  }

  @SubscribeMessage(LEAVE_ROOM_CHANNEL)
  async handleLeaveRoom(@MessageBody() codeRoom: string, @ConnectedSocket() client: SocketClient) {
    try {
      let room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);

      if (!room) {
        this.socketService.sendError(client, errorsSocket.ROOM_NOT_FOUND);
        throw new WsException(errorsSocket.ROOM_NOT_FOUND);
      }

      await Promise.all([
        this.redisService.deleteObjectByKey(`USER:${client.user.id}:ROOM`),
        this.roomUserService.deleteRoomUser(room.id, client.user.id),
      ]);

      const meesageContent: Chat = {
        user: client.user.nickname,
        type: LEAVE_ROOM_TYPE,
        message: LEAVE_ROOM_CONTENT,
      };

      client.leave(codeRoom);
      client.to(codeRoom).emit(`${codeRoom}-leave`, meesageContent);

      if (client.user.id === room.host_id) {
        room = await this.roomService.changeHost(codeRoom);
      }

      await this.socketService.checkAndEmitToHostRoom(this.server, room);

      await this.socketService.sendListParticipantsInRoom(this.server, room);

      const roomRound = await this.roomRoundService.getRoundOfRoom(room.id);
      if (!roomRound) return;

      const participants = await this.roomUserService.getListUserOfRoom(room);
      if (participants.length === 1) {
        await this.roomRoundService.deleteRoomRound(room.id);
        this.server.in(room.code_room).emit('reset-game');
      } else {
        await this.socketService.handlePainterOrNextPainterOutRoom(roomRound, client.user.id, this.server, room);
      }

      await this.socketService.sendListParticipantsInRoom(this.server, room);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
