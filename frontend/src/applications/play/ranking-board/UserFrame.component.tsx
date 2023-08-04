/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, DialogTrigger } from '@/shared/components/shadcn-ui/Modal';
import FlipMove from 'react-flip-move';
import React, { useRef, useState } from 'react';
import { DialogDemo } from './UserDialog.component';
import { cn } from '@/shared/lib/utils';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/shadcn-ui/avatar-shadcn';
import {
  BadgeCheck,
  Home,
  Pencil,
  XCircle,
  User2 as UserIcon,
  Play,
} from 'lucide-react';
import { handleStringThatIsTooLong } from '@/shared/lib/string';
import { useGameStore } from '@/shared/stores/gameStore';
import { useUserStore } from '@/shared/stores/userStore';

interface ProfileProps {
  rankingBoard: Array<Participant>;
  maxPlayer: number;
}

const UserFrame: React.FC<ProfileProps> = ({ maxPlayer, rankingBoard }) => {
  const [userSelected, setUserSelected] = useState<Participant>();
  const [blockedIdArray, setBlockedIdArray] = useState<number[]>([]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { user } = useUserStore();

  const handleOpenUserProfile = (participant: Participant) => {
    const host = userHost();
    if (host && user && host.id === user.id && participant.id !== user.id) {
      setUserSelected(participant);
      triggerRef.current?.click();
    }
  };

  const userHost = (): Participant | null => {
    const host = rankingBoard.find((user: Participant) => user.is_host);

    return host ? host : null;
  }

  const { gameStatus, correctAnswers } = useGameStore();
  const { user: me } = useUserStore(); 
  const renderItem = () => {
    const maxItems = maxPlayer;
    const emptySlots = maxItems - rankingBoard.length;
    return (
      <>
        <FlipMove className="flip-wrapper" 
          duration={400}
          delay={10}
          easing={'cubic-bezier(0.25, 0.5, 0.75, 1)'}
          staggerDurationBy={30}
          staggerDelayBy={150}
          appearAnimation="accordionVertical"
          enterAnimation="fade" 
          leaveAnimation="fade">
          {[...rankingBoard]
            .sort((a, b) => b.score - a.score)
            .map((user: Participant, _index) => (
              <li
                key={user.id}
                className="relative flex w-full py-3 border-b-2 border-gray-100 cursor-pointer sm:py-4 group"
                onClick={() => handleOpenUserProfile(user)}
              >
                {user.id === me?.id && (
                  <div className={cn("absolute left-[65px] 2xl:left-[74px] rotate-90", {
                    "top-0": _index === 0,
                    "top-1": _index !== 0,
                  })}>
                    <Play size={14} fill='#FFC95F' />
                  </div>
                )}
                <div className="flex items-center w-full space-x-3">
                  <div
                    className={
                      'flex items-center space-x-4 w-[25px] 2xl:w-[40px]'
                    }
                  >
                    {gameStatus !== 'wait-for-players' &&
                      user.is_painter && (
                        <Pencil color="#3f84f3" size={32} strokeWidth={3.5} />
                      )}
                    {correctAnswers.includes(user.id) && (
                      <BadgeCheck size={32} color="#12d94d" strokeWidth={2.5} />
                    )}
                  </div>
                  <div
                    className={cn(
                      'flex items-center space-x-4 justify-between w-full',
                      {
                        ' text-[#FFB84C] font-bold': user.id === me?.id,
                        'text-blue-600 font-bold':
                        user.is_painter ,
                        'text-green-500': correctAnswers.includes(user.id),
                      }
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar
                        className={cn(
                          'relative flex items-center bg-yellow-300 w-[68px] h-auto group-hover:scale-110 overflow-visible border-4 border-solid',
                          {
                            'border-blue-500':  user.is_painter ,
                            'border-green-500': correctAnswers.includes(
                              user.id
                            ),
                          }
                        )}
                      >
                        <AvatarImage
                          src={user.avatar}
                          alt="avatar"
                          className="border-2 border-white border-solid rounded-full"
                        />
                        <AvatarFallback>Avatar</AvatarFallback>
                        {_index < 3 && (
                          <div
                            className={cn(
                              'h-4 w-4 rounded-full absolute right-0 bottom-0 shadow-md',
                              { 'bg-yellow-400': _index === 0 },
                              { 'bg-slate-300': _index === 1 },
                              { 'bg-yellow-700': _index === 2 }
                            )}
                          ></div>
                        )}
                        {blockedIdArray.find((id) => id === user.id) && (
                          <XCircle
                            size={56}
                            color="#f43e47"
                            strokeWidth={2.5}
                            className="absolute w-4/5 -translate-x-1/2 -translate-y-1/2 rounded-full h-4/5 left-1/2 top-1/2"
                          />
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-lg text-left truncate max-w-[180px] 2xl:max-w-[200px] dark:text-white"
                          title={user.nickname}
                        >
                          {handleStringThatIsTooLong(user.nickname, 10)}
                        </p>
                        <p className="font-medium text-left truncate text-md text-textBlueColor dark:text-gray-400">
                          <strong>{user.score}</strong>
                          <span> pts</span>
                        </p>
                        { user.is_next_painter && (
                          <p className="font-medium text-left text-blue-500 truncate text-md dark:text-gray-400">
                            Next to draw
                          </p>
                        )}
                      </div>
                    </div>
                    {user.is_host && (
                      <Home
                        className="text-blue-500"
                        strokeWidth={2.5}
                        size={32}
                      />
                    )}
                  </div>
                </div>
              </li>
            ))}
        </FlipMove>
        {/* Render empty slots */}
        {emptySlots > 0 &&
          Array.from({ length: emptySlots }).map((_item, index) => (
            <li
              key={index}
              className="flex py-3 border-b-2 border-gray-100 sm:py-4"
            >
              <div className="flex items-center w-full space-x-3">
                <div
                  className={
                    'flex items-center space-x-4 w-[25px] 2xl:w-[40px]'
                  }
                ></div>
                <div
                  className={`flex items-center space-x-4 justify-between w-full`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-[68px] h-[68px] rounded-full border-4 border-solid border-gray-400 flexCenter">
                      <UserIcon
                        size={46}
                        strokeWidth={2.5}
                        className="text-gray-400"
                      />
                    </div>
                    <div className="flex items-center flex-1 min-w-0 text-xl font-bold text-gray-400">
                      Empty
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
      </>
    );
  };

  return (
    <div
      id="profile"
      className="self-center w-full h-full py-4 bg-white bg-center border border-gray-200 rounded-[10px] shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flow-root w-full h-full px-4 overflow-auto no-scrollbar">
        <ul role="list">{renderItem()}</ul>
      </div>
      { }
      <Dialog>
        <DialogTrigger ref={triggerRef}></DialogTrigger>
        <DialogDemo
          user={userSelected ? userSelected : null}
          blockedIdArray={blockedIdArray}
          setBlockedIdArray={setBlockedIdArray}
          triggerRef={triggerRef}
        />
      </Dialog>
    </div>
  );
};

export default UserFrame;
