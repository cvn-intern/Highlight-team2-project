import { Dialog, DialogTrigger } from '@/common/components/ui/Modal';
import FlipMove from 'react-flip-move';
import React, { useRef, useState } from 'react';
import { DialogDemo } from './modals/ProfileModal';
import { cn } from '@/common/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar-shadcn';
import { ILeaderboard } from './RankingBoard';
import emptyPerson from '@/common/assets/emptyPerson.jpg';

interface ProfileProps {
    Leaderboard: ILeaderboard[];
}

const UserFrame: React.FC<ProfileProps> = ({ Leaderboard }) => {
    const [data, setData] = useState<ILeaderboard[]>([
        {
            "user": {
                "id": 95,
                "avatar": "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
                "nickname": "userednz2h 2"
            },
            "score": 0,
            "answered_at": null
        },
        {
            "user": {
                "id": 96,
                "avatar": "https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj",
                "nickname": "userednz2h 10"
            },
            "score": 10,
            "answered_at": null
        }

    ])
    console.log(data)
    const [userSelected, setUserSelected] = useState<ILeaderboard['user'] | null>(null)
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const handleLinkClick = ({ user }: ILeaderboard) => {
        setUserSelected(user)
        triggerRef.current?.click()
    };
    const renderItem = (xxxxx: ILeaderboard[]) => {
        const maxItems = 10; // Maximum number of items to render

        // Calculate the number of empty slots
        const emptySlots = maxItems - xxxxx.length;

        const clickSort = () => {
            const temp = [...data].sort((a, b) => b.score - a.score)
            setData(temp)
        }

        return (
            <>
                <button onClick={clickSort}>Click me</button>
                <FlipMove>
                    {data.slice(0, maxItems).map((value, _index) => (
                        <button key={value.user.id} className="group block cursor-pointer w-full" onClick={() => handleLinkClick(value)}>
                            <li className="py-3 sm:py-4 flex">
                                <div className="flex items-center space-x-3 w-full">
                                    <div className={cn('flex items-center space-x-4 w-[40px]', value.type)}>
                                        {value.icon && <value.icon size={36} strokeWidth={3.5} />}
                                    </div>
                                    <div className={cn('flex items-center space-x-4 justify-between w-full', value.type)}>
                                        <div className='flex items-center space-x-4'>
                                            <Avatar className="relative flex items-center bg-yellow-300 w-[70px] h-auto 
                                    group-hover:scale-110 overflow-visible">
                                                <AvatarImage src={value?.user.avatar} alt="avatar" className='rounded-full' />
                                                <AvatarFallback>Avatar</AvatarFallback>
                                                {_index < 3 && (
                                                    <div className={cn("h-4 w-4 rounded-full absolute right-0 bottom-0 shadow-md",
                                                        { "bg-yellow-400": _index === 0 },
                                                        { "bg-slate-300": _index === 1 },
                                                        { "bg-yellow-600": _index === 2 })}>
                                                    </div>
                                                )}
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-lg font-medium text-truncate dark:text-white">
                                                    {value.user.nickname}
                                                </p>
                                                <p className="text-md font-medium text-textBlueColor truncate dark:text-gray-400">
                                                    <strong>{value.score}</strong>
                                                    <span> pts</span>
                                                </p>
                                            </div>

                                        </div>
                                        {/* {value.host && <Home color="#2062fb" strokeWidth={2.5} size={36} />} */}
                                    </div>
                                </div>
                            </li>
                        </button>
                    ))}
                </FlipMove>
                {/* Render empty slots */}
                {emptySlots > 0 && Array.from({ length: emptySlots }).map((_) => (
                    <li className="py-3 sm:py-4 flex">
                        <div className="flex items-center space-x-3">
                            <div className='flex items-center space-x-4 w-[40px]'></div>
                            <div className='flex items-center space-x-4 w-full'>
                                <Avatar className="relative flex items-center bg-yellow-300 w-1/5 h-auto overflow-visible">
                                    <AvatarImage src={emptyPerson} alt="avatar" className='rounded-full' />
                                    <AvatarFallback>Avatar</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-2xl font-normal dark:text-white whitespace-nowrap">
                                        Empty Slot
                                    </p>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </>
        );
    };


    console.log('render');
    return (
        <div id="profile" className="w-full max-w-md h-full py-4  bg-white border border-gray-200 
        rounded-lg shadow  dark:bg-gray-800 dark:border-gray-700 bg-center self-center">
            <div className="flow-root w-full h-full overflow-auto px-4 scrollbar-thin  scrollbar-thumb-slate-400  scrollbar-thumb-rounded-md">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {renderItem(data)}
                </ul>
            </div>
            { }
            <Dialog>
                <DialogTrigger ref={triggerRef}>
                </DialogTrigger>
                <DialogDemo user={userSelected} />
            </Dialog>
        </div>
    );
};

export default UserFrame;