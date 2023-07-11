import { Check, Home, LucideIcon } from 'lucide-react';
import React from 'react';

interface ProfileProps {
    Leaderboard: Array<{
        img: string;
        name: string;
        score: number;
        icon?: LucideIcon;
    }>;
}

const Profiles: React.FC<ProfileProps> = ({ Leaderboard }) => {
    const renderItem = (data: typeof Leaderboard) => (
        <>
            {data.map((value, _index) => (
                // <div className="item rounded-md overflow-hidden bg-blue-400" key={index}>
                //     <div className="flex items-center">
                //         <img src={value.img} alt="" className="rounded-full" />
                //         <div className="info ml-2">
                //             <h3 className="name text-dark">{value.name}</h3>
                //             <span>{value.score}</span>
                //         </div>
                //     </div>
                //     <div className="item"></div>
                // </div>
                <div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                        <li className="py-3 sm:py-4">
                            <div className="flex items-center space-x-4">
                                <Check size={48} color="#22A62F" strokeWidth={4} />
                                <div className="flex-shrink-0">
                                    <img className="w-20 h-20 rounded-full" src={value.img} alt="avatar" />
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

                    </ul>
                </div>



            ))}
        </>
    );

    return (
        <div id="profile" className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 bg-center self-center">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white flex items-center justify-center">Leaderboard</h5>

            </div>
            {renderItem(Leaderboard)}
        </div>
    );
};

export default Profiles;