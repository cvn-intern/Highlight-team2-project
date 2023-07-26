import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/shadcn-ui/avatar-shadcn";
import { ERROR_ICON } from "@/shared/constants";
import useToaster from "@/shared/hooks/useToaster";
import roomService from "@/shared/services/roomService";
import { Globe, Swords, User2 as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const RoomInformation = () => {
    const { codeRoom } = useParams();
    const navigate = useNavigate();
    const [roomData, setRoomData] = useState<RoomType>();

    useEffect(() => {
        const getRoomInformation = async () => {
            if (!codeRoom) return;
            try {
                const { data } = await roomService.getRoom(codeRoom);
                
                setRoomData(data);
            } catch (error) {
                useToaster({
                    type: "error",
                    message: "Room not found!",
                    bodyClassName: "text-lg font-semibold text-slate-600 text-center",
                    icon: ERROR_ICON,
                    progressStyle: {
                        background: "linear-gradient(90deg, rgba(241,39,17,1) 0%, rgba(245,175,25,1) 100%)",
                    }
                })
                navigate('/')
            }
        };

        getRoomInformation();
    }, [])


    return (
        <div className="flex flex-col items-center justify-center basis-1/2 flex-1 bg-[#00416A]/50 rounded-2xl p-2 ">
            <div className=" bg-white flex flex-col items-center m-2 rounded-2xl p-5  h-full">
                <p className="text-xl font-medium bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                    <strong>{roomData && roomData.words_collection.theme.name.toUpperCase()} #{roomData && roomData.code_room}</strong>
                </p>
                <div className="bg-white flex flex-col md:flex-row text-left m-2 rounded-2xl p-2 md:p-8 h-full">
                    <div className="flex flex-col text-left gap-4 m-5 md:gap-10 xl:gap-20 home-content-responsive h-full">
                        <div className="flex flex-row items-center space-x-4">
                            <Avatar className="relative flex items-center bg-yellow-300 w-[80px] h-auto overflow-visible border-4 border-solid">
                                <AvatarImage
                                    src={roomData ? roomData.thumbnail : ""}
                                    alt="thumbnail"
                                    className="border-2 border-white border-solid rounded-full"
                                />
                                <AvatarFallback><UserIcon /></AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-medium text-slate-400 text-center max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                                    THEME
                                </p>
                                <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                                    <strong>{roomData && roomData.words_collection.theme.name}</strong>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center space-x-4">
                            <div className="w-[80px] h-[80px] rounded-full border-4 border-solid flexCenter bg-gradient-to-r from-[#f7b733] to-[#0575E6] text-transparent">
                                <Swords
                                    size={46}
                                    strokeWidth={2.5}
                                    className="text-white"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-medium text-slate-400 text-center max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                                    LANGUAGE
                                </p>
                                <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                                    <strong>{roomData && roomData.language.name}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col text-left gap-4 m-5 md:gap-10 xl:gap-20 home-content-responsive h-full">
                        <div className="flex flex-row items-center space-x-4">
                            <div className="w-[80px] h-[80px] rounded-full border-4 border-solid  flexCenter bg-gradient-to-r from-[#f7b733] to-[#0575E6] text-transparent">
                                <Globe
                                    size={46}
                                    strokeWidth={2.5}
                                    className="text-white"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-medium text-slate-400 text-center max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                                    ROUND
                                </p>
                                <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                                    <strong>{roomData && roomData.number_of_round}</strong>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center space-x-4">
                            <div className="w-[80px] h-[80px] rounded-full border-4 border-solid  flexCenter bg-gradient-to-r from-[#f7b733] to-[#0575E6] text-transparent">
                                <UserIcon
                                    size={46}
                                    strokeWidth={2.5}
                                    className="text-white"
                                />
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-lg font-medium text-slate-400 text-center max-w-[180px] 2xl:max-w-[200px] dark:text-white">
                                    PLAYERS
                                </p>
                                <p className="font-medium text-2xl text-center bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent">
                                    <strong>{roomData && roomData.participants}/{roomData && roomData.max_player}</strong>
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


