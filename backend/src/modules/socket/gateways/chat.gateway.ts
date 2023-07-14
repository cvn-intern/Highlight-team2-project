import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { UserService } from 'src/modules/user/user.service';
import { SocketService } from '../socket.service';
import { expireTimeOneDay } from 'src/common/variables/constVariable';
import { extractIdRoom } from 'src/common/utils/helper';

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
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: Socket,
  ) {
    const payload = await this.socketService.extractPayload(client);
    const user = await this.userService.getUserById(payload.id);
    
    if(user) {
      await this.redisService.setObjectByKeyValue(`USER:${user.id}:ROOM`, codeRoom, expireTimeOneDay);
      
      client.join(codeRoom);
  
      if(codeRoom !== null) {
        const idRoom = extractIdRoom(codeRoom);
        await this.roomUserService.createNewRoomUser(idRoom, user.id);
      }
  
      this.server.in(codeRoom).emit(codeRoom, {
        user: user.nickname,
        content: 'joined',
        type: 'text-green-400',
        icon: 'Info',
      } as Chat);
    }
  }

  @SubscribeMessage('chat')
  async handleMessageChatBox(
    @MessageBody() msgBody: MessageBodyInterface,
    @ConnectedSocket() client: Socket,
  ) {
    const payload = await this.socketService.extractPayload(client);
    const user = await this.userService.getUserById(payload.id);

    if(user) {
      this.server.in(msgBody.codeRoom).emit(`${msgBody.codeRoom}-chat`, {
        user: user.nickname,
        content: msgBody.message,
        type: 'text-blue-600',
        icon: 'MessageCircle',
      } as Chat)
    }
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: Socket,
  ) {
    const payload = await this.socketService.extractPayload(client);
    const user = await this.userService.getUserById(payload.id);

    if(user) {
      client.to(codeRoom).emit(`${codeRoom}-leave`, {
        user: user.nickname,
        content: 'left',
        type: 'text-neutral-600',
        icon: 'LogOut',
      } as Chat);
      client.leave(codeRoom);
    }
  }
}