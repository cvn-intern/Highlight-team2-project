
import { useTranslation } from "react-i18next";
import { TEXT_BLUE, TEXT_GREEN, TEXT_ORANGE, TEXT_RED, TEXT_ZINC } from "../shared/constants/color";

const JOIN_ROOM_TYPE = 0;
const LEAVE_ROOM_TYPE = 1;
const CHAT_ROOM_TYPE = 2;
const ANSWER_CORRETLY = 3;
const ANSWER_APPROXIMATELY = 4;
const ANSWER_WRONG = 5;
const BLOCK_MESSAGE = 6;
const HOST_KICK_USER = 7;


export const useConvertMessage = () => {
  const { t } = useTranslation();

  const convertMessage = (message: MessageReceiver): Chat => {
    const result: Chat = {
      user: message.user,
      content: '',
      type: '',
      icon: '',
    }

    switch (message.type) {
      case JOIN_ROOM_TYPE:
        result.content = t("PlayingGame.chatAndAnswerResponse.joinRoom");
        result.type = TEXT_GREEN;
        result.icon = 'Info';

        break;
      case LEAVE_ROOM_TYPE:
        result.content = t("PlayingGame.chatAndAnswerResponse.leaveRoom");
        result.type = TEXT_RED;
        result.icon = 'LogOut';

        break;
      case CHAT_ROOM_TYPE:
        result.content = message.message;
        result.type = TEXT_BLUE;
        result.icon = 'MessageCircle';

        break;
      case ANSWER_CORRETLY:
        result.content = t("PlayingGame.chatAndAnswerResponse.answerCorrectly");
        result.type = TEXT_GREEN;
        result.icon = 'CheckCircle2';

        break;
      case ANSWER_APPROXIMATELY:
        result.content = t("PlayingGame.chatAndAnswerResponse.answerApproximately");
        result.type = TEXT_ORANGE;
        result.icon = 'Zap';

        break;
      case ANSWER_WRONG:
        result.content = message.message;
        result.type = TEXT_ZINC;
        result.icon = 'XCircle';

        break;
      case BLOCK_MESSAGE:
        result.content = t("PlayingGame.chatAndAnswerResponse.serverBlockedMessage");
        result.type = TEXT_RED;
        result.icon = 'Ban';

        break;
      case HOST_KICK_USER:
        result.content = t("PlayingGame.chatAndAnswerResponse.hostKickUser");
        result.type = TEXT_RED;
        result.icon = 'Ban';

        break;
      default:
        break;
    }

    return result;
  }
  return { convertMessage }
}


export const GAME_UPDATE_RANKING = "update-ranking"
