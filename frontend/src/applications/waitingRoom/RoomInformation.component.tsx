import JoinRoomBanner from "@/shared/assets/joinRoomBanner.png";
import SloganImg from "@/shared/assets/slogan.png";
import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import { Button } from "@/shared/components/shadcn-ui/Button";
import PlayForm from "../home/PlayForm.component";
import PlayerInfomation from "./PlayerInfomation.component";
import { useNavigate } from "react-router-dom";
import ControllerIcon from "@/shared/assets/controller-icon.svg"
import { useUserStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";
import userService from "@/shared/services/userService";
import playService from "@/shared/services/playService";
import { useSocketStore } from "@/shared/stores/socketStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/shadcn-ui/avatar-shadcn";

const RoomInformation = () => {
    return (
        <div className="flex flex-col items-center justify-center w-[50%] bg-slate-300 rounded-2xl p-2">
            <div className=" bg-white flex flex-col items-center m-2 rounded-2xl p-8 h-full">
                <p className="text-xl font-medium text-blue-500 ">
                    <strong>YOUR INFORMATION</strong>
                </p>
                <div className="flex items-center gap-4 mb-8 md:gap-10 xl:gap-20 home-content-responsive h-full">
                    <div className="flex items-center space-x-4">
                        <Avatar className="relative flex items-center bg-yellow-300 w-[80px] h-auto overflow-visible border-4 border-solid">
                            <AvatarImage
                                src="https://yt3.googleusercontent.com/-CFTJHU7fEWb7BYEb6Jh9gm1EpetvVGQqtof0Rbh-VQRIznYYKJxCaqv_9HeBcmJmIsp2vOO9JU=s900-c-k-c0x00ffffff-no-rj"
                                alt="thumbnail"
                                className="border-2 border-white border-solid rounded-full"
                            />
                            <AvatarFallback>Avatar</AvatarFallback>
                        </Avatar>
                        <PlayForm />
                    </div>
                </div>
                <div className="flex items-center gap-4 mb-8 md:gap-10 xl:gap-20 home-content-responsive h-full">
                    <PlayForm />
                    <PlayForm />
                </div>
            </div>
        </div>
    );
};

export default RoomInformation;


