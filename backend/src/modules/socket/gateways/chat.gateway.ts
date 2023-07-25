import { SubscribeMessage, MessageBody, ConnectedSocket, WsException, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { expireTimeOneDay } from '../../../common/variables/constVariable';
import { extractIdRoom } from '../../../common/utils/helper';
import { ANSWER_ROOM_CHANNEL, CHAT_ROOM_CHANNEL, INFO_ICON, JOIN_ROOM_CHANNEL, LEAVE_ROOM_CHANNEL, LOGOUT_ICON, MESSAGECIRCLE_ICON, TEXT_BLUE, TEXT_GREEN, TEXT_RED } from '../constant';
import { SocketClass } from '../socket.class';
import { Socket } from 'socket.io';
import { Chat } from '../types/chat';
import { MessageBodyType } from '../types/messageBody';
import { Room } from 'src/modules/room/room.entity';
import errosMap from 'src/common/errors/codeError';

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

        client.leave(codeRoom);

        if (codeRoom !== null) {
          const idRoom = extractIdRoom(codeRoom);
          await this.roomUserService.deleteRoomUser(idRoom, user.id);
        }

        const ROOM_LEAVE = `${codeRoom}-leave`

        this.server.in(codeRoom).emit(ROOM_LEAVE, {
          user: user.nickname,
          content: 'left',
          type: TEXT_RED,
          icon: LOGOUT_ICON,
        });

        await this.redisService.deleteObjectByKey(`USER:${user.id}:ROOM`);
        await this.redisService.deleteObjectByKey(`USER:${user.id}:SOCKET`);
        await this.redisService.deleteObjectByKey(`${client.id}:ACCESSTOKEN`)
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
        this.socketService.sendError(client, JSON.stringify(errosMap.get('NOTVALIDTOKEN')));
        return;
      }

      const isMultipleTab = await this.socketService.checkLoginMultipleTab(client);

      if (isMultipleTab) {
        await this.redisService.setObjectByKeyValue(`BLOCKLIST:SOCKET:${client.id}`, client.id, expireTimeOneDay * 365);
        this.socketService.sendError(client, JSON.stringify(errosMap.get('MULTIPLETAB')));
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
    @ConnectedSocket() client: SocketClass,
  ) {
    try {
      const idRoom: number = extractIdRoom(codeRoom);
      const room: Room = await this.roomService.getRoomByCodeRoom(codeRoom);

      if (!room) {
        this.socketService.sendError(client, JSON.stringify(errosMap.get('NOTFOUNDROOM')));
        throw new WsException(JSON.stringify(errosMap.get('NOTFOUNDROOM')));
      }

      const isAvailableRoom: boolean = await this.roomService.checkRoomAvailability(codeRoom);

      if(!isAvailableRoom) {
        this.socketService.sendError(client, JSON.stringify(errosMap.get('ROOMFULL')));
        throw new WsException(JSON.stringify(errosMap.get('ROOMFULL')));
      }

      const participant = await this.roomService.joinRoom(idRoom, client.user.id);

      if (!participant) {
        this.socketService.sendError(client, JSON.stringify(errosMap.get('CANNOTJOIN')));
        throw new WsException(JSON.stringify(errosMap.get('CANNOTJOIN')));
      }

      await this.redisService.setObjectByKeyValue(`USER:${client.user.id}:ROOM`, codeRoom, expireTimeOneDay);

      client.join(codeRoom);

      const chatContent: Chat = {
        user: client.user.nickname,
        content: 'joined',
        type: TEXT_GREEN,
        icon: INFO_ICON,
      };

      this.server.in(codeRoom).emit(codeRoom, chatContent);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage(CHAT_ROOM_CHANNEL)
  async handleMessageChatBox(
    @MessageBody() msgBody: MessageBodyType,
    @ConnectedSocket() client: SocketClass,
  ) {
    try {
      const ROOM_CHAT: string = `${msgBody.codeRoom}-chat`;

      const chatContent: Chat = {
        user: client.user.nickname,
        content: msgBody.message,
        type: TEXT_BLUE,
        icon: MESSAGECIRCLE_ICON,
      };

      this.server.in(msgBody.codeRoom).emit(ROOM_CHAT, chatContent)
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SubscribeMessage(LEAVE_ROOM_CHANNEL)
  async handleLeaveRoom(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClass,
  ) {
    try {
      const chatContent: Chat = {
        user: client.user.nickname,
        content: 'left',
        type: TEXT_RED,
        icon: LOGOUT_ICON,
      };

      client.to(codeRoom).emit(`${codeRoom}-leave`, chatContent);
      client.leave(codeRoom);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
