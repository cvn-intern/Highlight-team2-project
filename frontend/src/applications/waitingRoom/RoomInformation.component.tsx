import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/shadcn-ui/avatar-shadcn";
import { Globe, Swords, User2 as UserIcon } from "lucide-react";

const RoomInformation = () => {
    return (
        <div className="flex flex-col items-center justify-center basis-1/2 flex-1 bg-slate-300 rounded-2xl p-2 ">
            <div className=" bg-white flex flex-col items-center m-2 rounded-2xl p-5  h-full">
                <p className="text-xl font-medium text-blue-500 ">
                    <strong>CHỖ NÀY ĐỂ TÊN THEME VỚI MÃ PHÒNG</strong>
                </p>
                <div className="bg-white flex flex-col md:flex-row text-left m-2 rounded-2xl p-2 md:p-8 h-full">
                    <div className="flex flex-col text-left gap-4 m-5 md:gap-10 xl:gap-20 home-content-responsive h-full">
                        <div className="flex flex-row items-center space-x-4">
                            <Avatar className="relative flex items-center bg-yellow-300 w-[80px] h-auto overflow-visible border-4 border-solid">
                                <AvatarImage
                                    src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.6435-1/108183626_2708185066093656_2321218826465342306_n.jpg?stp=dst-jpg_p200x200&_nc_cat=100&cb=99be929b-59f725be&ccb=1-7&_nc_sid=7206a8&_nc_ohc=v8CiEr2-bLEAX-MJd2v&_nc_ht=scontent.fsgn2-7.fna&oh=00_AfDTck5bjeB2zzDz1pf4kpWKxMTHU6zChm5pw7mvtIzDMg&oe=64E694C4"
                                    alt="thumbnail"
                                    className="border-2 border-white border-solid rounded-full"
                                />
                                <AvatarFallback>thumbnail</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-medium text-slate-400 text-center max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                                    THEME
                                </p>
                                <p className="font-medium text-2xl text-center text-slate-500 dark:text-gray-400">
                                    <strong>General</strong>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center space-x-4">
                            <div className="w-[80px] h-[80px] rounded-full border-4 border-solid  flexCenter">
                                <Swords
                                    size={46}
                                    strokeWidth={2.5}
                                    className="text-blue-500"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-medium text-slate-400 text-center max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                                    LANGUAGE
                                </p>
                                <p className="font-medium text-2xl text-center text-slate-500 dark:text-gray-400">
                                    <strong>Engrisk</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col text-left gap-4 m-5 md:gap-10 xl:gap-20 home-content-responsive h-full">
                        <div className="flex flex-row items-center space-x-4">
                            <div className="w-[80px] h-[80px] rounded-full border-4 border-solid  flexCenter">
                                <Globe
                                    size={46}
                                    strokeWidth={2.5}
                                    className="text-blue-500"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-medium text-slate-400 text-center max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                                    ROUND
                                </p>
                                <p className="font-medium text-2xl text-center text-slate-500 dark:text-gray-400">
                                    <strong>5</strong>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center space-x-4">
                            <div className="w-[80px] h-[80px] rounded-full border-4 border-solid  flexCenter">
                                <UserIcon
                                    size={46}
                                    strokeWidth={2.5}
                                    className="text-blue-500"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-medium text-slate-400 text-center max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                                    PLAYERS
                                </p>
                                <p className="font-medium text-2xl text-center text-slate-500 dark:text-gray-400">
                                    <strong>5/5</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomInformation;


