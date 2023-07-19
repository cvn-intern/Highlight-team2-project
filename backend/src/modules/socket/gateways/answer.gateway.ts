import { ConnectedSocket, MessageBody, SubscribeMessage } from "@nestjs/websockets";
import { SocketGateway } from "./socket.gateway";
import { ANSWER_ROOM_CHANNEL, CHECKCIRCLE_ICON, TEXT_GREEN, TEXT_ORANGE, TEXT_ZINC, XCIRLE_ICON, ZAP_ICON } from "../constant";
import { SocketClass } from "../socket.class";
import { MessageBodyType } from "../types/messageBody";
import { checkTypeAnswer } from "../../../common/utils/helper";
import { ANSWER_APPROXIMATELY, ANSWER_CORRETLY, ANSWER_WRONG } from "src/common/variables/constVariable";
import { Chat } from "../types/chat";

export class AnswerGateway extends SocketGateway {
    @SubscribeMessage(ANSWER_ROOM_CHANNEL)
    async handleAnswer(
        @MessageBody() msgBody: MessageBodyType,
        @ConnectedSocket() client: SocketClass,
    ) {
        try {
            const answerRound: string = 'animal';
            const ROOM_ANSWER: string = `${msgBody.codeRoom}-answer`;

            const typeAnswer = checkTypeAnswer(answerRound, msgBody.message);
            const answerContent: Chat = {
                user: client.user.nickname,
                content: '',
                type: '',
                icon: '',
            }

            switch (typeAnswer) {
                case ANSWER_CORRETLY:
                    answerContent.content = 'hit!';
                    answerContent.type = TEXT_GREEN;
                    answerContent.icon = CHECKCIRCLE_ICON;

                    break;
                case ANSWER_APPROXIMATELY:
                    answerContent.content = 'answer is close!';
                    answerContent.type = TEXT_ORANGE;
                    answerContent.icon = ZAP_ICON;

                    break;
                case ANSWER_WRONG:
                    answerContent.content = msgBody.message;
                    answerContent.type = TEXT_ZINC;
                    answerContent.icon = XCIRLE_ICON;

                    break;
                default:
                    break;
            }

            this.server.in(msgBody.codeRoom).emit(ROOM_ANSWER, answerContent)

        } catch (error) {
            this.logger.error(error);
        }
    }
}