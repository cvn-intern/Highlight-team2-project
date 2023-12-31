/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { useNavigate } from "react-router-dom";
import { DoorOpen, Triangle } from "lucide-react";
import { useSocketStore } from "@/shared/stores/socketStore";
import { Button } from "@/shared/components/shadcn-ui/Button";
import Logo from "@/shared/components/Logo";
import ListOfRoom from "./ListOfRoom.component";
import SloganImg from "@/shared/assets/slogan.png";
import useToaster from "@/shared/hooks/useToaster";
import RoomFilterForm from "./RoomFilterForm.component";
import MainLayout from "@/shared/components/MainLayout";
import ControllerIcon from "@/shared/assets/controller-icon.svg";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
import { useTranslation } from "react-i18next";

const RoomsPage = () => {
  const navigate = useNavigate();
  const [roomFilterData, setRoomFilterData] = useState<RoomList[]>([]);
  const [selectCodeRoom, setSelectCodeRoom] = useState<string>("");
  const { socket } = useSocketStore();
  const { t } = useTranslation();

  const handleBackButton = () => {
    navigate("/");
  };

  const handleJoinRoom = async () => {
    try {
      if (selectCodeRoom) {
        socket?.emit("join-room", selectCodeRoom);
        navigate("/" + selectCodeRoom, {
          state: { wait: false },
          replace: false,
        });
      }
    } catch (error) {
      useToaster({
        type: "error",
        message: t("toastMessage.error.joinRoom")
      });
    }
  };

  const handleJoinCreateRoom = async () => {
    try {
      navigate("/rooms/create-room", {
        state: { wait: false },
        replace: false,
      });
    } catch (error) {
      useToaster({
        type: "error",
        message: t("toastMessage.error.joinRoom"),
      });
    }
  };

  useDisableBackButton();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full">
        <Logo customClassname="max-md:mt-12" />
        <img
          src={SloganImg}
          alt="Slogan"
          className="slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5"
        />
        <div className="relative bg-white flex flex-col items-center my-5 w-[92%] xl:w-3/4 2xl:w-3/5 min-h-[70vh] rounded-2xl pb-5">
          <div className="flex items-center">
            <button
              onClick={handleBackButton}
              className="md:mx-5 mb-2 max-sm:ml-10"
            >
              <Triangle
                size={40}
                strokeWidth={2.5}
                className="-rotate-90 fill-[#f7b733] hover:opacity-80"
              />
            </button>

            <RoomFilterForm setRoomFilterData={setRoomFilterData} />
          </div>


          <div className="flex flex-col items-start justify-center flex-1 w-11/12 h-full gap-4 p-1 mb-2 overflow-y-scrol bg-white home-content-responsive">
            <ListOfRoom
              roomFilter={roomFilterData}
              selectCodeRoom={selectCodeRoom}
              setSelectCodeRoom={setSelectCodeRoom}
            />
          </div>
          <div className="flex gap-3 my-2">
            <Button
              type="submit"
              variant="opacityHover"
              className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-gradient-to-r from-[#005AA7] to-[#FFFDE4] p-5"
              onClick={handleJoinCreateRoom}
            >
              <DoorOpen />
              <p>{t("RoomList.newRoomButton")}</p>
            </Button>
            <Button
              type="submit"
              variant="opacityHover"
              className={cn(
                "gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black p-5",
                selectCodeRoom
                  ? "bg-gradient-to-r from-[#f7b733] to-[#E4E5E6]"
                  : "bg-gradient-to-r from-[#bdc3c7] to-[#2c3e50]"
              )}
              onClick={handleJoinRoom}
              disabled={!selectCodeRoom}
            >
              <img src={ControllerIcon} alt="" className="w-[25%]" />
              <p>{t("PlayLabel")}</p>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RoomsPage;
