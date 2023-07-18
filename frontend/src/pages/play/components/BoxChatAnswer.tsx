import { useEffect, useState } from 'react'
import { Edit2, LucideIcon, MessageCircle, Pencil } from "lucide-react"
import './styles/style.css'
import { cn } from '@/common/lib/utils'
import { useSocketStore } from '@/common/stores/socketStore'
import { iconsMap } from '../constants/icons'

type Props = {
}

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
  const { icon: Icon, type } = props

  return (
    <div className={`${type} flex gap-2`}>
      {Icon && <Icon strokeWidth={3} />}
      <strong>
        {props.user}
      </strong>
      <span> {props.content}</span>
    </div>
  )
}

interface MessageBodyInterface {
  codeRoom: string;
  message: string;
}

interface Chat {
  user: string;
  content: string;
  type: string;
  icon: string;
}

const BoxChat = (props: BoxProps) => {
  const { icon: Icon } = props;
  const [inputChat, SetInputChat] = useState("")
  const { socket } = useSocketStore()
  const codeRoom = window.location.href.split("/")[window.location.href.split("/").length - 1]

  const handleChat = (e: any) => {
    if (e.key === 'Enter') {
      if (inputChat.trim() !== '') {
        if(props.label === 'chat') {
          socket?.emit('chat-room', {
            codeRoom: codeRoom,
            message: inputChat,
          } as MessageBodyInterface)
        }

        SetInputChat("")
      }
    }
  }

  return (
    <>
      <div className='lg:box relative w-[100%]'>
        <div className='lg:box-label shadow-lg'>
          <span>{props.label.toLocaleUpperCase()}</span>
        </div>
        <div>
          <div className='lg:box-content min-h-[110px] max-h-[115px] overflow-auto pr-2 scrollbar-thin  scrollbar-thumb-slate-400  scrollbar-thumb-rounded-md'>
            {
              props.listChat.map((ele: any, index: number) => (
                <Message key={index} user={ele.user} content={ele.content} type={ele.type} icon={iconsMap.get(ele.icon)} />
              ))
            }

          </div>
          <div className='relative'>
            <input value={inputChat} onChange={(e) => SetInputChat(e.target.value)} onKeyDown={(e) => handleChat(e)}
              id={'box-input-' + props.label} type="text" placeholder={props.placeholder}
              className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 pl-10" />
            <label htmlFor={'box-input-' + props.label} className='lg:box-input-icon'>
              {Icon && <Icon />}
            </label>
          </div>
        </div>
      </div>
    </>
  )
}
const BoxChatAnswer = ({ }: Props) => {
  const { socket } = useSocketStore()
  const codeRoom = window.location.href.split("/")[window.location.href.split("/").length - 1]
  const [listChat, setListChat] = useState<Array<Chat>>([])
  const [listAnswer, setListAnswer] = useState<Array<Chat>>([])

  useEffect(() => {
    socket?.on(codeRoom, (data: Chat) => {
      setListChat(pre => [...pre, data])
    })

    socket?.on(`${codeRoom}-chat`, (data: Chat) => {
      console.log(data);
      setListChat(pre => [...pre, data])
    })

    socket?.on(`${codeRoom}-leave`, (data: Chat) => {
      console.log(data);
      setListChat(pre => [...pre, data])
    })

    return () => {
      socket?.off(codeRoom)
      socket?.off(`${codeRoom}-chat`)
      socket?.off(`${codeRoom}-leave`)
    }
  }, [socket])

  return (
    <>
      <div className='flex item-center bg-white rounded-lg mt-2'>
        <div className='pr-2 border-r w-[50%]'>
          <BoxChat label="answer" placeholder="Hit answer here!" icon={Pencil} listChat={listAnswer} />
        </div>
        <div className='pl-2 border-l w-[50%]'>
          <BoxChat label="chat" placeholder="Hit chat here!" icon={MessageCircle} listChat={listChat} />
        </div>
      </div>
    </>
  )
}

export default BoxChatAnswer
