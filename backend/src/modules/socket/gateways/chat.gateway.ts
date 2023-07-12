import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from './socket.gateway';
import { UserService } from 'src/modules/user/user.service';
import { SocketService } from '../socket.service';

interface MessageBodyInterface {
  codeRoom: string;
  message: string;
}

export class ChatGateway extends SocketGateway {
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: Socket,
  ) {
    const payload = await this.socketService.extractPayload(client);
    const user = await this.userService.getUserById(payload.id);

    client.join(codeRoom);
    client.to(codeRoom).emit(codeRoom, `${user.nickname} joined`);
  }

  @SubscribeMessage('chat')
  async handleMessageChatBox(
    @MessageBody() msgBody: MessageBodyInterface,
    @ConnectedSocket() client: Socket,
  ) {
    const payload = await this.socketService.extractPayload(client);
    const user = await this.userService.getUserById(payload.id);
    
    this.server.in(msgBody.codeRoom).emit(`${msgBody.codeRoom}-chat`, `${user.nickname} ${msgBody.message}`)
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @MessageBody() codeRoom: string,
    @ConnectedSocket() client: Socket,
  ) {
    const payload = await this.socketService.extractPayload(client);
    const user = await this.userService.getUserById(payload.id);

    client.leave(codeRoom);
    client.to(codeRoom).emit(codeRoom, `${user.nickname} left`);
  }
}