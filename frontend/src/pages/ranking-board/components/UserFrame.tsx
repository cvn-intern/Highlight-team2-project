import { Dialog, DialogTrigger } from '@/common/components/ui/Modal';
import { Check, Home, LucideIcon } from 'lucide-react';
import React from 'react';
import { DialogDemo } from './modals/ProfileModal';

interface ProfileProps {
    Leaderboard: Array<{
        img: string;
        name: string;
        score: number;
        icon?: LucideIcon;
    }>;
}

const UserFrame: React.FC<ProfileProps> = ({ Leaderboard }) => {
    const renderItem = (data: typeof Leaderboard) => (
        <>
            {data.map((value, _index) => (
                <Dialog>
                    <DialogTrigger asChild>
                        <a href="#" className="group block">
                            <li className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <Check size={36} color="#22A62F" strokeWidth={4} />
                                    <div className="flex-shrink-0">
                                        <img className="w-20 h-20 rounded-full group-hover:scale-110" src={value.img} alt="avatar" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-medium text- truncate dark:text-white">
                                            {value.name}
                                        </p>
                                        <p className="text-sm text-textBlueColor truncate dark:text-gray-400">
                                            {value.score}
                                        </p>
                                    </div>
                                    <Home color="#2062fb" strokeWidth={2.5} />
                                </div>
                            </li>
                        </a>
                    </DialogTrigger>
                    <DialogDemo />
                </Dialog>
            ))}
        </>
    );

    return (
        <div id="profile" className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 bg-center self-center">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white flex items-center justify-center">Leaderboard</h5>

            </div>

            <div className="flow-root">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {renderItem(Leaderboard)}
                </ul>
            </div>

        </div>
    );
};

export default UserFrame;