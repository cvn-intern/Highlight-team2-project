import JoinRoomBanner from "@/shared/assets/joinRoomBanner.png";
import SloganImg from "@/shared/assets/slogan.png";
import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import { Button } from "@/shared/components/shadcn-ui/Button";
import PlayerInfomation from "./PlayerInformation.component";
import { useNavigate, useParams } from "react-router-dom";
import ControllerIcon from "@/shared/assets/controller-icon.svg"
import { useUserStore } from "@/shared/stores/userStore";
import { useEffect, useState } from "react";
import userService from "@/shared/services/userService";
import { useSocketStore } from "@/shared/stores/socketStore";
import RoomInformation from "./RoomInformation.component";
import ErrorSocketType from "@/shared/types/errorSocket";
import { Triangle } from "lucide-react";

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
    if (!nickname) alert("Please enter your nickname");

    try {
      if (user?.nickname !== nickname) {
        const { data } = await userService.updateUser({
          ...user,
          nickname,
        });

        setUser(data);
      }

      socket?.emit("join-room", codeRoom);
      socket?.on('error', (data: string) => {
        const error: ErrorSocketType = JSON.parse(data);
        alert(error.message);
        navigate("/");
      });
      navigate("/" + codeRoom);
    } catch (error) {
      console.log({ error });
    }
  }

  useEffect(() => {
    if (!user) return;
    setNickname(user.nickname);
  }, [user]);

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
          <button className="absolute top-1 left-4 md:left-10 mt-5 mr-5" onClick={handleBackButton}>
            <Triangle size={40} strokeWidth={2.5} className="-rotate-90 fill-[#f7b733] hover:opacity-80" />
          </button>

          <div className="flex items-stretch justify-center gap-4 mb-8 home-content-responsive bg-white h-full p-8 md:p-0" >
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


