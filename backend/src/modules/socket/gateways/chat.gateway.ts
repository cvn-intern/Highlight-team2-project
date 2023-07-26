import { SubscribeMessage, MessageBody, ConnectedSocket, WsException, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { expireTimeOneDay } from '../../../common/variables/constVariable';
import { extractIdRoom } from '../../../common/utils/helper';
import { CHAT_ROOM_CHANNEL, CHAT_ROOM_TYPE, JOIN_ROOM_CHANNEL, JOIN_ROOM_CONTENT, JOIN_ROOM_TYPE, LEAVE_ROOM_CHANNEL, LEAVE_ROOM_CONTENT, LEAVE_ROOM_TYPE, QUALIFY_TO_START_CHANNEL } from '../constant';
import { SocketClient } from '../socket.class';
import { Socket } from 'socket.io';
import { Chat } from '../types/chat';
import { MessageBodyType } from '../types/messageBody';
import { Room } from 'src/modules/room/room.entity';
import { errorsSocket } from 'src/common/errors/errorCode';

export class ChatGateway extends SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  async handleDisconnect(@ConnectedSocket() client: any) {
    try {
      const isBlock = await this.socketService.checkInBlockList(client);

      if (isBlock) {
        return;
      }

      this.socketService.removeClientDisconnection(client);

      const payload = await this.socketService.extractPayload(client);

      if (!payload) {
        this.logger.warn(`${client.id} invalid credential!`);
        return;
      }

      const user = await this.userService.getUserById(payload.id);

      if (user) {
        const codeRoom = await this.redisService.getObjectByKey(
          `USER:${user.id}:ROOM`,
        );

        const room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);

        client.leave(codeRoom);

        if (codeRoom !== null) {
          const idRoom = extractIdRoom(codeRoom);
          await this.roomUserService.deleteRoomUser(idRoom, user.id);
        }

        const ROOM_LEAVE = `${codeRoom}-leave`

        this.server.in(codeRoom).emit(ROOM_LEAVE, {
          user: user.nickname,
          type: LEAVE_ROOM_TYPE,
          message: LEAVE_ROOM_CONTENT,
        });

        if (client.user.id === room.host_id) {
          await this.roomService.changeHost(codeRoom);
        }
  
        const isPlayingRoom = await this.roomService.checkStartGame(room.id);
  
        if (isPlayingRoom) {
          const isQualified = await this.roomService.qualifiedToStart(room.code_room);
  
          if (!isQualified) {
            const hostRoomSocketId = await this.redisService.getObjectByKey(`USER:${room.host_id}:SOCKET`);
  
            this.server.to(hostRoomSocketId).emit(QUALIFY_TO_START_CHANNEL, isQualified);
          }
        } else {
          this.socketService.checkAndEmitToHostRoom(this.server, room);
        }

        await Promise.all([
          this.redisService.deleteObjectByKey(`USER:${user.id}:ROOM`),
          this.redisService.deleteObjectByKey(`USER:${user.id}:SOCKET`),
          this.redisService.deleteObjectByKey(`${client.id}:ACCESSTOKEN`),
        ]);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const isValidToken = await this.socketService.checkTokenValidSocket(client);

      if (!isValidToken) {
        await this.redisService.setObjectByKeyValue(`BLOCKLIST:SOCKET:${client.id}`, client.id, expireTimeOneDay * 365);
        this.socketService.sendError(client, errorsSocket.INVALID_TOKEN);
        return;
      }

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

  @SubscribeMessage(JOIN_ROOM_CHANNEL)
  async handleJoinRoom(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    try {
      const idRoom: number = extractIdRoom(codeRoom);
      const room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);

      if (!room) {
        this.socketService.sendError(client, errorsSocket.ROOM_NOT_FOUND);
        throw new WsException(errorsSocket.ROOM_NOT_FOUND);
      }

      const isAvailableRoom: boolean = await this.roomService.checkRoomAvailability(codeRoom);

      if (!isAvailableRoom) {
        this.socketService.sendError(client, errorsSocket.ROOM_FULL);
        throw new WsException(errorsSocket.ROOM_FULL);
      }

      const participant = await this.roomService.joinRoom(idRoom, client.user.id);

      if (!participant) {
        this.socketService.sendError(client, errorsSocket.CAN_NOT_JOIN);
        throw new WsException(errorsSocket.CAN_NOT_JOIN);
      }

      await this.redisService.setObjectByKeyValue(`USER:${client.user.id}:ROOM`, codeRoom, expireTimeOneDay);

      client.join(codeRoom);

      const chatContent: Chat = {
        user: client.user.nickname,
        type: JOIN_ROOM_TYPE,
        message: JOIN_ROOM_CONTENT,
      };

      await this.roomService.changeHost(codeRoom);

      this.server.in(codeRoom).emit(codeRoom, chatContent);

      this.socketService.checkAndEmitToHostRoom(this.server, room);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage(CHAT_ROOM_CHANNEL)
  async handleMessageChatBox(
    @MessageBody() msgBody: MessageBodyType,
    @ConnectedSocket() client: SocketClient,
  ) {
    try {
      const ROOM_CHAT: string = `${msgBody.codeRoom}-chat`;

      const chatContent: Chat = {
        user: client.user.nickname,
        type: CHAT_ROOM_TYPE,
        message: msgBody.message,
      };

      this.server.in(msgBody.codeRoom).emit(ROOM_CHAT, chatContent)
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage(LEAVE_ROOM_CHANNEL)
  async handleLeaveRoom(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClient,
  ) {
    try {
      const room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);

      if (!room) {
        this.socketService.sendError(client, errorsSocket.ROOM_NOT_FOUND);
        throw new WsException(errorsSocket.ROOM_NOT_FOUND);
      }

      const chatContent: Chat = {
        user: client.user.nickname,
        type: LEAVE_ROOM_TYPE,
        message: LEAVE_ROOM_CONTENT,
      };

      const roomId = extractIdRoom(codeRoom);

      await Promise.all([
        this.redisService.deleteObjectByKey(`USER:${client.user.id}:ROOM`),
        this.roomUserService.deleteRoomUser(roomId, client.user.id),
      ]);

      client.to(codeRoom).emit(`${codeRoom}-leave`, chatContent);
      client.leave(codeRoom);

      if (client.user.id === room.host_id) {
        await this.roomService.changeHost(codeRoom);
      }

      const isPlayingRoom = await this.roomService.checkStartGame(room.id);

      if (isPlayingRoom) {
        const isQualified = await this.roomService.qualifiedToStart(room.code_room);

        if (!isQualified) {
          const hostRoomSocketId = await this.redisService.getObjectByKey(`USER:${room.host_id}:SOCKET`);

          this.server.to(hostRoomSocketId).emit(QUALIFY_TO_START_CHANNEL, isQualified);
        }
      } else {
        this.socketService.checkAndEmitToHostRoom(this.server, room);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
