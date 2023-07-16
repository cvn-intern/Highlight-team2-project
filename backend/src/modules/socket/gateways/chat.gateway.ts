import { SubscribeMessage, MessageBody, ConnectedSocket, WsException } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { expireTimeOneDay } from '../../../common/variables/constVariable';
import { extractIdRoom } from '../../../common/utils/helper';
import { CHAT_ROOM_CHANNEL, INFO_ICON, JOIN_ROOM_CHANNEL, LEAVE_ROOM_CHANNEL, LOGOUT_ICON, MESSAGECIRCLE_ICON, TEXT_BLUE, TEXT_GREEN, TEXT_RED } from '../constant';
import { SocketClass } from '../socket.class';

interface MessageBodyInterface {
  codeRoom: string;
  message: string;
}

interface Chat {
  user: string;
  content: string;
  type: string;
  icon: string;
}

export class ChatGateway extends SocketGateway {
  @SubscribeMessage(JOIN_ROOM_CHANNEL)
  async handleJoinRoom(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: SocketClass,
  ) {
    try {
      await this.roomService.getRoomByCodeRoom(codeRoom);
  
      await this.redisService.setObjectByKeyValue(`USER:${client.id}:ROOM`, codeRoom, expireTimeOneDay);
  
      client.join(codeRoom);
  
      const idRoom = extractIdRoom(codeRoom);
      await this.roomUserService.createNewRoomUser(idRoom, client.user.id);
  
      this.server.in(codeRoom).emit(codeRoom, {
        user: client.user.nickname,
        content: 'joined',
        type: TEXT_GREEN,
        icon: INFO_ICON,
      } as Chat);
    } catch (error) {
      this.logger.error(error);
    } 
  }

  @SubscribeMessage(CHAT_ROOM_CHANNEL)
  async handleMessageChatBox(
    @MessageBody() msgBody: MessageBodyInterface,
    @ConnectedSocket() client: SocketClass,
  ) {
    try {
      this.server.in(msgBody.codeRoom).emit(msgBody.codeRoom, {
        user: client.user.nickname,
        content: msgBody.message,
        type: TEXT_BLUE,
        icon: MESSAGECIRCLE_ICON,
      } as Chat)
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
      client.to(codeRoom).emit(codeRoom, {
        user: client.user.nickname,
        content: 'left',
        type: TEXT_RED,
        icon: LOGOUT_ICON,
      } as Chat);
      client.leave(codeRoom);
    } catch (error) {
      this.logger.error(error);      
    }
  }
}
