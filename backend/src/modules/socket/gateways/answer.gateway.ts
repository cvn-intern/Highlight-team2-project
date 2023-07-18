import { ConnectedSocket, MessageBody, SubscribeMessage } from "@nestjs/websockets";
import { ANSWER_ROOM_CHANNEL, CORRECT_ANSWER_ICON, MESSAGECIRCLE_ICON, TEXT_BLUE, TEXT_GREEN } from "../constant";
import { SocketClass } from "../socket.class";
import { Chat } from "../types/chat";
import { MessageBodyType } from "../types/messageBody";
import { SocketGateway } from "./socket.gateway";

export class AnswerGateway extends SocketGateway {
    @SubscribeMessage(ANSWER_ROOM_CHANNEL)
    async handleAnswer(
        @MessageBody() msgBody: MessageBodyType,
        @ConnectedSocket() client: SocketClass,
    ) {
        try {

            const ROOM_ANSWER: string = `${msgBody.codeRoom}-answer`;
 
            
            if (this.checkAnswer(msgBody.message)){
                const chatContent: Chat = {
                    user: client.user.nickname,
                    content: msgBody.message,
                    type: TEXT_GREEN,
                    icon: CORRECT_ANSWER_ICON,
                };
                this.server.in(msgBody.codeRoom).emit(ROOM_ANSWER, chatContent)
            }else{

            }

           
        } catch (error) {
            this.logger.error(error);
        }
    }

    checkAnswer(answer:string){
        return true;
    }
}


