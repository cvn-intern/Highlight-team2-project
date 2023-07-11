import React from 'react'
import { MessageCircle, Pencil } from "lucide-react";
import '../styles/style.css'
import { cn } from '@/common/lib/utils';

type Props = {
}

interface BoxProps {
  type: number; // 0: answer, 1: chat
  label: string;
  placeholder: string;
  icon: string;
  listChat: any;
  custumClassName?: string;
}

interface MessageProps {
  user: string;
  content: string;
  type?: string;
}

const Message = (props: MessageProps) => {
  return (
    <>
      <div className={cn('text-black', props.type)}>
        <strong>
          {props.user}
        </strong>
        <span> {props.content}</span>
      </div>
    </>
  )
}

const Box = (props: BoxProps) => {
  return (
    <>
      <div className='lg:box relative'>
        <div className='lg:box-label'>
          <span>{props.label.toLocaleUpperCase()}</span>
        </div>
        <div>
          <div className='lg:box-content'>
            {
              props.listChat.map((ele: any, index: number) => (
                <Message key={index} user={ele.user} content={ele.content} type={ele.type}/>
              ))
            }

          </div>
          <div className='relative'>
            <input id={'box-input-' + props.label} type="text" placeholder={props.placeholder} className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1 pl-10" />
            <label htmlFor={'box-input-' + props.label} className='lg:box-input-icon'>
              {
                props.type === 0 ? <Pencil /> : <MessageCircle />
              }
            </label>
          </div>
        </div>
      </div>
    </>
  )
}


const BoxChatAnswer = (props: Props) => {
  const listChat = [
    {
      user: 'Tư Mã Ý',
      content: 'hit answer!',
      type: 'text-red-600'
    },
    {
      user: 'Gia Cat Luong',
      content: 'is corrected!',
      type: 'text-green-600',
    }
  ]

  const listAnswer = [
    {
      user: 'Tư Mã Ý',
      content: 'hit answer!',
    },
    {
      user: 'Gia Cat Luong',
      content: 'is corrected!',
    }
  ]



  return (
    <>
      <div className='flex item-center bg-white'>
        <div className='mr-2'>
          <Box label="answer" placeholder="Hit answer here!" icon="pencil" type={0} listChat={listChat}/>
        </div>
        <div className='ml-2'>
          <Box label="chat" placeholder="Hit chat here!" icon="pencil" type={1} listChat={listAnswer}/>
        </div>
      </div>
    </>
  )
}

export default BoxChatAnswer