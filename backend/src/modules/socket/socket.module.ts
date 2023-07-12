import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { DrawGateway } from './draw/draw.gateway';


@Module({
  imports: [],
  providers: [ChatGateway, DrawGateway],
})
export class SocketAppModule {}