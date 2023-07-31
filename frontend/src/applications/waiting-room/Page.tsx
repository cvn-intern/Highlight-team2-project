import ControllerIcon from "@/shared/assets/controller-icon.svg";
import JoinRoomBanner from "@/shared/assets/join-room-banner.png";
import SloganImg from "@/shared/assets/slogan.png";
import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import { Button } from "@/shared/components/shadcn-ui/Button";
import userService from "@/shared/services/userService";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useUserStore } from "@/shared/stores/userStore";
import { Triangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayerInfomation from "./PlayerInformation.component";
import RoomInformation from "./RoomInformation.component";
import useToaster from "@/shared/hooks/useToaster";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
import { MULTIPLE_TAB } from "@/shared/types/errorCode";

const WaitingRoom = () => {
  const { user, setUser } = useUserStore();
  const [nickname, setNickname] = useState<string>("");
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { codeRoom } = useParams();

  const handleBackButton = () => {
    navigate("/");
  };

  const handleJoinRoom = async () => {
    if (!nickname.trim()) {
      useToaster({
        type: "warning",
        message: "Please enter your nickname!",
      });
      return;
    }
    try {
      if (user?.nickname !== nickname) {
        const { data } = await userService.updateUser({
          ...user,
          nickname,
        });

        setUser(data);
      }
      socket?.emit("join-room", codeRoom);

      navigate("/" + codeRoom, { state: { wait: false }, replace: false });
    } catch (error) {
      
      useToaster({
        type: "error",
        message: "Join room failed!",
      });
    }
  };

  useEffect(() => {
    if (!user) return;
    setNickname(user.nickname);
  }, [user]);

  useEffect(() => {
    socket?.on("error", (error: ErrorSocket) => {
      if(error.code === MULTIPLE_TAB) {
        navigate("/user/existing");
      } else {
        useToaster({
          type: "error",
          message: error.message,
        })

        navigate("/");
      }
    });
  }, [socket])

  useDisableBackButton();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full">
        <Logo customClassname="max-md:mt-12" />
        <img
          src={SloganImg}
          alt=""
          className="slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5"
        />

        <div className="relative lg:min-w-[80vw] lg:min-h-[70vh] bg-white flex flex-col items-center mb-5 w-[80vw] sm:w-[80vw] min-h-[70vh] mt-5 rounded-2xl pb-8">
          <img
            src={JoinRoomBanner}
            className="mt-1 mb-1 2xl:my-5 w-[500px] max-md:hidden"
          />
          <button
            className="absolute mt-5 mr-5 top-1 left-4 md:left-10"
            onClick={handleBackButton}
          >
            <Triangle
              size={40}
              strokeWidth={2.5}
              className="-rotate-90 fill-[#f7b733] hover:opacity-80"
            />
          </button>

          <div className="flex items-stretch justify-center h-full gap-4 p-8 mb-8 bg-white home-content-responsive md:p-0">
            <PlayerInfomation nickname={nickname} setNickname={setNickname} />
            <RoomInformation />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="opacityHover"
              className="gap-4 md:mt-2 mt-5 rounded-full border-8 border-black font-black bg-gradient-to-r from-[#f7b733] to-[#E4E5E6] p-5"
              onClick={handleJoinRoom}
            >
              <img src={ControllerIcon} alt="" className="w-[25%]" />
              <p>PLAY</p>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WaitingRoom;
