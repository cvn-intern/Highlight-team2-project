import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import { checkTypeAnswer, extractIdRoom } from '../../../common/utils/helper';
import {
  ANSWER_APPROXIMATELY,
  ANSWER_CORRETLY,
  BLOCK_MESSAGE,
  CHAT_ROOM_CHANNEL,
  CHAT_ROOM_TYPE,
  SERVER_BLOCKED_MESSAGE_CONTENT,
} from '../constant';
import { SocketClient } from '../socket.class';
import { Chat } from '../types/chat';
import { MessageBodyType } from '../types/messageBody';
import { RoomRound } from 'src/modules/room-round/roomRound.entity';

export class ChatGateway extends SocketGateway {
  @SubscribeMessage(CHAT_ROOM_CHANNEL)
  async handleMessageChatBox(@MessageBody() msgBody: MessageBodyType, @ConnectedSocket() client: SocketClient) {
    console.log('msgBody', msgBody);
    try {
      const roomId = extractIdRoom(msgBody.codeRoom);
      const round: RoomRound = await this.roomRoundService.getRoundOfRoom(roomId);
      const ROOM_CHAT = `${msgBody.codeRoom}-chat`;

      const messageContent: Chat = {
        user: client.user.nickname,
        type: CHAT_ROOM_TYPE,
        message: msgBody.message,
      };

      if (!round) {
        return this.server.to(msgBody.codeRoom).emit(ROOM_CHAT, messageContent);
      }

      const answerRound: string = round.word;
      const typeAnswer = checkTypeAnswer(answerRound.toLocaleUpperCase(), msgBody.message.toLocaleUpperCase());

      if (typeAnswer === ANSWER_CORRETLY || typeAnswer === ANSWER_APPROXIMATELY) {
        messageContent.message = SERVER_BLOCKED_MESSAGE_CONTENT;
        messageContent.type = BLOCK_MESSAGE;
        messageContent.user = '';

        return this.server.to(client.id).emit(ROOM_CHAT, messageContent);
      }

      return this.server.to(msgBody.codeRoom).emit(ROOM_CHAT, messageContent);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
