import { SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { AbstractGateway } from '../shared/abstract.gateway';
import { Server, Socket } from 'socket.io';

const users = {}

export class ChatGateway extends AbstractGateway {

  @SubscribeMessage('join-room')
  handleJoinRoom(client: Socket, {room, name}:{room: string, name: string}): void {
    console.log(room);
    users[client.id] = name
    client.join(room)
    client.broadcast.to(room).emit('user', name)
  }

  @SubscribeMessage('chat')
  handleMessage(client: Socket, {room, message}: {room: string, message: string}): void{
    this.server.to(room).emit('chat-content', {message, name: users[client.id]})
  }

  @SubscribeMessage('leave-room')
  handleLeave(client: Socket, room: string): void{
    client.leave(room)
    this.server.to(room).emit('leave-room', users[client.id])
  }

}
