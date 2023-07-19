import { SubscribeMessage, MessageBody, ConnectedSocket, WsException, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { expireTimeOneDay } from '../../../common/variables/constVariable';
import { extractIdRoom } from '../../../common/utils/helper';
import { ANSWER_ROOM_CHANNEL, CHAT_ROOM_CHANNEL, INFO_ICON, JOIN_ROOM_CHANNEL, LEAVE_ROOM_CHANNEL, LOGOUT_ICON, MESSAGECIRCLE_ICON, TEXT_BLUE, TEXT_GREEN, TEXT_RED } from '../constant';
import { SocketClass } from '../socket.class';
import { Socket } from 'socket.io';
import { Chat } from '../types/chat';
import { MessageBodyType } from '../types/messageBody';

export class ChatGateway extends SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {

  async handleDisconnect(@ConnectedSocket() client: any) {
    try {
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
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    try {
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
      await this.roomService.getRoomByCodeRoom(codeRoom);

      await this.redisService.setObjectByKeyValue(`USER:${client.user.id}:ROOM`, codeRoom, expireTimeOneDay);

      client.join(codeRoom);

      const idRoom = extractIdRoom(codeRoom);
      await this.roomUserService.createNewRoomUser(idRoom, client.user.id);

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
