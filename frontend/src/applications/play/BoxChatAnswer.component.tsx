import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { LucideIcon, MessageCircle, Pencil } from "lucide-react";
import "./styles/style.css";
import { iconsMap } from "./constants/icons";
import { useSocketStore } from "@/shared/stores/socketStore";
import { cn } from "@/shared/lib/utils";
import { useParams } from "react-router-dom";
import { MAX_NUMBER_OF_CHARACTER } from "@/shared/constants";
import { throttle } from "lodash";
import { Chat, MessageReceiver } from "./chatAnswer";
import { covertMessage } from "./chatAnswer.helper";

interface BoxProps {
  label: string;
  placeholder: string;
  listChat: any;
  custumClassName?: string;
  icon?: LucideIcon;
}

interface MessageProps {
  user: string;
  content: string;
  type?: string;
  icon?: LucideIcon;
}

const Message = (props: MessageProps) => {
  const { icon: Icon } = props;

  return (
    <div className={cn("text-green-400 flex gap-2 break-words", props.type)}>
      {Icon && <Icon strokeWidth={3} />}
      <strong>{props.user}</strong>
      <span className='max-w-[190px]'> {props.content}</span>
    </div>
  );
};

interface MessageBodyInterface {
  codeRoom: string;
  message: string;
}

const BoxChat = (props: BoxProps) => {
  const { icon: Icon } = props;
  const [inputChat, SetInputChat] = useState("");
  const [numberOfCharactersLeft, setNumberOfCharactersLeft] = useState<number>(
    MAX_NUMBER_OF_CHARACTER
  );
  const messagesEndRef = useRef<any>(null)
  useEffect(() => {
    setNumberOfCharactersLeft(MAX_NUMBER_OF_CHARACTER - inputChat.length);
  }, [inputChat]);
  const { socket } = useSocketStore();
  const { codeRoom } = useParams();

  const sendMessages = (message: string) => {
    if (message.trim() === "") return;

    if (props.label === "chat") {
      socket?.emit("chat-room", {
        codeRoom: codeRoom,
        message,
      } as MessageBodyInterface);
    } else {
      socket?.emit("answer-room", {
        codeRoom: codeRoom,
        message,
      } as MessageBodyInterface);
    }

    SetInputChat("");
  };

  const throttledSendMessages = useCallback(throttle(sendMessages, 300), []);

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    throttledSendMessages(inputChat);
  };

  const handleInputText = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > MAX_NUMBER_OF_CHARACTER) return;
    SetInputChat(e.target.value);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [props.listChat])

  return (
    <>
      <div className="box relative w-[100%]">
        <div className="shadow-lg box-label">
          <span>{props.label.toLocaleUpperCase()}</span>
        </div>
        <div>
          <div className="h-[--chat-content-heigth] overflow-auto pr-2 scrollbar-thin  scrollbar-thumb-slate-400  scrollbar-thumb-rounded-md">
            {props.listChat.map((ele: any, index: number) => (
              <Message
                key={index}
                user={ele.user}
                content={ele.content}
                type={ele.type}
                icon={iconsMap.get(ele.icon)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="relative">
            <form onSubmit={handleSubmitForm} className="relative">
              <input
                value={inputChat}
                onChange={handleInputText}
                id={"box-input-" + props.label}
                type="text"
                placeholder={props.placeholder}
                className="block w-full py-2 pl-10 pr-20 mt-1 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 sm:text-sm focus:ring-1 rounded-[4px]"
              />
              <span className="absolute text-[10px] text-slate-400 top-1/2 -translate-y-1/2 right-2">
                {numberOfCharactersLeft} chars left
              </span>
            </form>
            <label
              htmlFor={"box-input-" + props.label}
              className="box-input-icon"
            >
              {Icon && <Icon />}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

const BoxChatAnswer = () => {
  const { socket } = useSocketStore();
  const { codeRoom } = useParams();
  const [listChat, setListChat] = useState<Array<Chat>>([]);
  const [listAnswer, setListAnswer] = useState<Array<Chat>>([]);

  useEffect(() => {
    if (!codeRoom) return;
    socket?.on(codeRoom, (data: MessageReceiver) => {
      const convertData: Chat = covertMessage(data);
      setListChat((pre) => [...pre, convertData]);
    });

    socket?.on(`${codeRoom}-chat`, (data: MessageReceiver) => {
      const convertData: Chat = covertMessage(data);
      setListChat((pre) => [...pre, convertData]);
    });

    socket?.on(`${codeRoom}-answer`, (data: MessageReceiver) => {
      const convertData: Chat = covertMessage(data);
      setListAnswer((pre) => [...pre, convertData]);
    });

    socket?.on(`${codeRoom}-leave`, (data: MessageReceiver) => {
      const convertData: Chat = covertMessage(data);
      setListChat((pre) => [...pre, convertData]);
    });

    return () => {
      socket?.off(codeRoom);
      socket?.off(`${codeRoom}-chat`);
      socket?.off(`${codeRoom}-answer`);
      socket?.off(`${codeRoom}-leave`);
    };
  }, [socket]);

  return (
    <>
      <div className="w-[var(--canvas-width)] flex-1 flex item-center bg-white rounded-[10px] mt-2 relative">
        <div className="pr-2 border-r w-[50%]">
          <BoxChat
            label="answer"
            placeholder="Hit answer here!"
            icon={Pencil}
            listChat={listAnswer}
          />
        </div>
        <div className="pl-2 border-l w-[50%]">
          <BoxChat
            label="chat"
            placeholder="Hit chat here!"
            icon={MessageCircle}
            listChat={listChat}
          />
        </div>
      </div>
    </>
  );
};

export default BoxChatAnswer;
