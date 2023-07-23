import { Dialog, DialogTrigger } from "@/shared/components/shadcn-ui/Modal";
import FlipMove from 'react-flip-move';
import React, { useRef, useState } from "react";
import { DialogDemo } from "./UserDialog.component";
import { cn } from "@/shared/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn-ui/avatar-shadcn";
import { ILeaderboard } from "./RankingBoard.component";
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import { BadgeCheck, Home, Pencil, XCircle } from "lucide-react";

interface ProfileProps {
  Leaderboard: ILeaderboard[];
  max_player: number;
  host_id: number;
  is_correct: boolean;
  drawer_id: number
}

const UserFrame: React.FC<ProfileProps> = (Leaderboard, _max_player) => {
  const [userSelected, setUserSelected] = useState<ILeaderboard["user"] | null>(
    null
  );
  const [blockedIdArray, setBlockedIdArray] = useState<number[]>([]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const handleLinkClick = (user: ILeaderboard["user"]) => {
    setUserSelected(user);
    triggerRef.current?.click();
  };
  const renderItem = (data: ProfileProps) => {
    const maxItems = data.max_player; // Maximum number of items to render

    // Calculate the number of empty slots
    const emptySlots = maxItems - data.Leaderboard.length;
    return (
      <>
        <FlipMove className="flip-wrapper">
          {data.Leaderboard.slice(0, maxItems).map(({user, score}, _index) => (
            <button
              key={_index}
              className="block w-full cursor-pointer group"
              onClick={() => handleLinkClick(user)}
            >
              <li className="flex py-3 sm:py-4">
                <div className="flex items-center w-full space-x-3">
                  <div
                    className={"flex items-center space-x-4 w-[25px] 2xl:w-[40px]"}>
                    {(user.id === data.drawer_id) && <Pencil color="#3f84f3" size={36} strokeWidth={3.5} />}
                    {data.is_correct && <BadgeCheck size={36} color="#12d94d" strokeWidth={2.5} />}
                  </div>
                  <div
                    className={cn(
                      "flex items-center space-x-4 justify-between w-full",
                      {
                        "text-blue-600": data.drawer_id === user.id,
                        "text-green-500": data.is_correct,
                      }
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar
                        className="relative flex items-center bg-yellow-300 w-[60px] h-auto 
                                    group-hover:scale-110 overflow-visible"
                      >
                        <AvatarImage
                          src={user.avatar}
                          alt="avatar"
                          className="rounded-full"
                        />
                        <AvatarFallback>Avatar</AvatarFallback>
                        {_index < 3 && (
                          <div
                            className={cn(
                              "h-4 w-4 rounded-full absolute right-0 bottom-0 shadow-md",
                              { "bg-yellow-400": _index === 0 },
                              { "bg-slate-300": _index === 1 },
                              { "bg-yellow-700": _index === 2 }
                            )}
                          ></div>
                        )}
                        {blockedIdArray.find(id => id === user.id) && <XCircle size={56} color="#f43e47" strokeWidth={2.5} className="h-4/5 w-4/5 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />}
                        
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-left truncate max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                          {user.nickname}
                        </p>
                        <p className="font-medium truncate text-left text-md text-textBlueColor dark:text-gray-400">
                          <strong>{score}</strong>
                          <span> pts</span>
                        </p>
                        {false && (
                          <p className="font-medium truncate text-left text-md text-blue-500 dark:text-gray-400">
                            Next to draw
                          </p>
                        )}
                      </div>
                    </div>
                    {(user.id === data.host_id) && <Home color="#2062fb" strokeWidth={2.5} size={36} />}
                  </div>
                </div>
              </li>
            </button>
          ))}
        </FlipMove>
        {/* Render empty slots */}
        {emptySlots > 0 && Array.from({ length: emptySlots }).map((_item, index) => (
          <li key={index} className="flex py-3 sm:py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-4 w-[40px]"></div>
              <div className="flex items-center w-full space-x-4">
                <Skeleton className="relative flex items-center w-[60px] h-[60px] overflow-visible bg-blue-200 rounded-full" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="relative flex items-center w-[100px] h-[20px] overflow-visible bg-blue-200 rounded" />
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
      className="self-center w-full h-full max-w-md py-4 bg-white bg-center border border-gray-200 rounded-[10px] shadow dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="flow-root w-full h-full px-4 overflow-auto no-scrollbar">
        <ul role="list">
          {renderItem(Leaderboard)}
        </ul>
      </div>
      { }
      <Dialog>
        <DialogTrigger ref={triggerRef}></DialogTrigger>
        <DialogDemo user={userSelected} blockedIdArray={blockedIdArray} setBlockedIdArray={setBlockedIdArray} />
      </Dialog>
    </div>
  );
};

export default UserFrame;