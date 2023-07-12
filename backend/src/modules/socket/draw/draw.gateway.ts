import { SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { AbstractGateway } from '../shared/abstract.gateway';
import { Server, Socket } from 'socket.io';

const users = {}

export class DrawGateway extends AbstractGateway {

  @SubscribeMessage('draw')
  handleJoinRoom(client: Socket, {room, name}:{room: string, name: string}): void {
    console.log(room);
    users[client.id] = name
    client.join(room)
    client.broadcast.to(room).emit('user', name)
  }
}
