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
import { Home, PenLine } from "lucide-react";

interface ProfileProps {
  Leaderboard: ILeaderboard[];
  max_player: number;
  host: boolean;
  is_correct: boolean;
}

const UserFrame: React.FC<ProfileProps> = (Leaderboard, _max_player) => {
  const [userSelected, setUserSelected] = useState<ILeaderboard["user"] | null>(
    null
  );
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const handleLinkClick = ({ user }: ILeaderboard) => {
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
          {data.Leaderboard.slice(0, maxItems).map((value, _index) => (
            <button
              key={_index}
              className="block w-full cursor-pointer group"
              onClick={() => handleLinkClick(value)}
            >
              <li className="flex py-3 sm:py-4">
                <div className="flex items-center w-full space-x-3">
                  <div
                    className={"flex items-center space-x-4 w-[40px]"}>
                    {!data.host && <PenLine color="#3f84f3" size={36} strokeWidth={3.5} />}
                  </div>
                  <div
                    className={cn(
                      "flex items-center space-x-4 justify-between w-full",
                      {
                        "text-blue-600": data.host,
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
                          src={value?.user.avatar}
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
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-truncate dark:text-white">
                          {value.user.nickname}
                        </p>
                        <p className="font-medium truncate text-left text-md text-textBlueColor dark:text-gray-400">
                          <strong>{value.score}</strong>
                          <span> pts</span>
                        </p>
                        {data.host && (
                          <p className="font-medium truncate text-left text-md text-textBlueColor dark:text-gray-400">
                            <strong>{value.score}</strong><span> pts</span>
                          </p>
                        )}
                      </div>
                    </div>
                    {data.host && <Home color="#2062fb" strokeWidth={2.5} size={36} />}
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
        <DialogDemo user={userSelected} />
      </Dialog>
    </div>
  );
};

export default UserFrame;