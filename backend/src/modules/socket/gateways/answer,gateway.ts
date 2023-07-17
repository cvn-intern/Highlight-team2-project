import { ConnectedSocket, MessageBody, SubscribeMessage } from "@nestjs/websockets";
import { SocketGateway } from "./socket.gateway";
import { ANSWER_ROOM_CHANNEL } from "../constant";
import { SocketClass } from "../socket.class";
import { MessageBodyType } from "../types/messageBody";

export class AnswerGateway extends SocketGateway {
    @SubscribeMessage(ANSWER_ROOM_CHANNEL)
    async handleAnswer(
        @MessageBody() msgBody: MessageBodyType,
        @ConnectedSocket() client: SocketClass,
    ) {
        
    }
}