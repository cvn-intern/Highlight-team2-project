import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
} from '@nestjs/websockets';
import { SocketGateway } from './socket.gateway';
import {
  ANSWER_APPROXIMATELY,
  ANSWER_APPROXIMATELY_CONTENT,
  ANSWER_CORRECTLY_CONTENT,
  ANSWER_CORRETLY,
  ANSWER_ROOM_CHANNEL,
  ANSWER_WRONG,
} from '../constant';
import { SocketClient } from '../socket.class';
import { MessageBodyType } from '../types/messageBody';
import { checkTypeAnswer, extractIdRoom } from '../../../common/utils/helper';
import { Chat } from '../types/chat';
import { RoomRound } from 'src/modules/room-round/roomRound.entity';

export class AnswerGateway extends SocketGateway {
  @SubscribeMessage(ANSWER_ROOM_CHANNEL)
  async handleAnswer(
    @MessageBody() msgBody: MessageBodyType,
    @ConnectedSocket() client: SocketClient,
  ) {
    try {
      const roomId = extractIdRoom(msgBody.codeRoom);
      const round: RoomRound = await this.roomRoundService.getRoundOfRoom(
        roomId,
      );
      const answerRound: string = round.word;
      const ROOM_ANSWER: string = `${msgBody.codeRoom}-answer`;

      const typeAnswer = checkTypeAnswer(answerRound.toLocaleUpperCase(), msgBody.message.toLocaleUpperCase());

      switch (typeAnswer) {
        case ANSWER_CORRETLY:
          const correctAnswer: Chat = {
            user: client.user.nickname,
            type: ANSWER_CORRETLY,
            message: ANSWER_CORRECTLY_CONTENT,
          };

          this.server.in(msgBody.codeRoom).emit(ROOM_ANSWER, correctAnswer);
          break;
        case ANSWER_APPROXIMATELY:
          const approximateAnswer: Chat = {
            user: client.user.nickname,
            type: ANSWER_APPROXIMATELY,
            message: ANSWER_APPROXIMATELY_CONTENT,
          };

          this.server.in(msgBody.codeRoom).emit(ROOM_ANSWER, approximateAnswer);
          break;
        case ANSWER_WRONG:
          const wrongAnswer: Chat = {
            user: client.user.nickname,
            type: ANSWER_WRONG,
            message: msgBody.message,
          };

          this.server.in(msgBody.codeRoom).emit(ROOM_ANSWER, wrongAnswer);
          break;
        default:
          break;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
