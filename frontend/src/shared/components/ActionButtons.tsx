import AlertDialogYesNo from "@/shared/components/AlertDialogYesNo";
import TooltipIcon from "@/shared/components/TooltipIcon";
import ExitImg from "@/shared/assets/exit.png";
import { LogOut, Volume2, VolumeX, X } from "lucide-react";
import { useState } from "react";
import Music from "@/shared/assets/music.mp3"
import { useNavigate, useParams } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";
import ShareRoomLinkDialog from "./ShareRoomLinkDialog";
import RoomInfomationDialog from "./RoomInfomationDialog";
import { RoomType } from "../types/room";

type ActionButtonsProps = {
  roomInfo?: RoomType;
};

const ActionButtons = ({ roomInfo }: ActionButtonsProps) => {
  const [isSound, setIsSound] = useState(false);
  const { socket } = useSocketStore();
  const { codeRoom } = useParams();
  const navigate = useNavigate();

  const toggleSound = () => setIsSound((prev) => !prev);
  const handleOutRoom = () => {
    socket?.emit("leave-room", codeRoom);
    navigate("/");
  }

  if (!roomInfo) return null;

  return (
    <div className="w-full absolute top-[-45px]">
      <div className="flex items-center justify-between w-full text-white">
        <div className="flex items-center gap-3">
          <TooltipIcon
            icon={isSound ? Volume2 : VolumeX}
            text="Sound"
            onClick={toggleSound}
          />

          <ShareRoomLinkDialog/>
        </div>
        <div className="flex items-center gap-3">
          <RoomInfomationDialog roomInfo={roomInfo} />

          <AlertDialogYesNo
            buttonContent={<TooltipIcon icon={X} text="Exit" />}
            buttonVariant={"link"}
            buttonClassName="text-white p-0"
            Icon={LogOut}
            iconSize={50}
            confirmText="Yes"
            cancelText="No"
            onYesClick={handleOutRoom}
            headerChildren={
              <img
                src={ExitImg}
                alt=""
                className="object-cover w-32 h-32 mb-2"
              />
            }
            alertMessage="Do you want to leave the game?"
            messageClassName="text-xl font-bold text-black"
            cancelClassName="rounded-full border-8 border-black font-black bg-gradient-to-r from-[#00416A] to-[#E4E5E6] p-5 w-[150px] text-xl text-black hover:text-white"
            confirmClassName="rounded-full border-8 border-black font-black bg-gradient-to-r from-[#ffd452] to-[#E4E5E6] p-5 w-[150px] text-xl text-black hover:text-white"
            containerClassName="h-[400px] flex flex-col items-center justify-center gap-10 border-8 border-[#00416A]/90"
          />
        </div>
      </div>
      <audio autoPlay loop muted={!isSound} >
          <source src={Music} type="audio/mpeg" />
        </audio>
    </div>
  );
};

export default ActionButtons;
