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
import RoomInformation from "./RoomInformation.component";

const WaitingRoom = () => {
  const { user, setUser } = useUserStore();
  const [nickname, setNickname] = useState<string>("");
  const navigate = useNavigate();
  const { socket } = useSocketStore();

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

      const { data } = await playService.quickPlay();

      navigate("/" + data);

      socket?.emit("join-room", data);
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

        <div className="lg:min-w-[80vw] lg:min-h-[70vh] bg-white flex flex-col items-center mb-5 w-[80vw] min-h-[70vh] mt-5 rounded-2xl p-8">
          <img
            src={JoinRoomBanner}
            className="mt-5 mb-2 2xl:my-5 w-[500px] max-md:hidden"
          />

          <div className="flex items-stretch justify-center gap-4 mb-8 ml-8 home-content-responsive bg-white h-full" >
            <PlayerInfomation nickname={nickname} setNickname={setNickname} />
            <RoomInformation />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="opacityHover"
              className="gap-4 md:mt-2 mt-5 rounded-full border-8 border-black font-black bg-[#FFE569] p-5"
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


