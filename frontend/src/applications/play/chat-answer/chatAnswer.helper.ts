import { TEXT_BLUE, TEXT_GREEN, TEXT_ORANGE, TEXT_RED, TEXT_ZINC } from "../shared/constants/color";

const JOIN_ROOM_TYPE = 0;
const LEAVE_ROOM_TYPE = 1;
const CHAT_ROOM_TYPE = 2;
const ANSWER_CORRETLY = 3;
const ANSWER_APPROXIMATELY = 4;
const ANSWER_WRONG = 5;

export const covertMessage = (message: MessageReceiver): Chat => {
  const result: Chat = {
    user: message.user,
    content: '',
    type: '',
    icon: '',
  }

  switch (message.type) {
    case JOIN_ROOM_TYPE:
      result.content = message.message;
      result.type = TEXT_GREEN;
      result.icon = 'Info';

      break;
    case LEAVE_ROOM_TYPE:
      result.content = message.message;
      result.type = TEXT_RED;
      result.icon = 'LogOut';

      break;
    case CHAT_ROOM_TYPE:
      result.content = message.message;
      result.type = TEXT_BLUE;
      result.icon = 'MessageCircle';

      break;
    case ANSWER_CORRETLY:
      result.content = message.message;
      result.type = TEXT_GREEN;
      result.icon = 'CheckCircle2';

      break;
    case ANSWER_APPROXIMATELY:
      result.content = message.message;
      result.type = TEXT_ORANGE;
      result.icon = 'Zap';

      break;
    case ANSWER_WRONG:
      result.content = message.message;
      result.type = TEXT_ZINC;
      result.icon = 'XCircle';

      break;
    default:
      break;
  }

  return result;
}