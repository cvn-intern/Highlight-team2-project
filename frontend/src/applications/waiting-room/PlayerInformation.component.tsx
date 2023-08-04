import { useUserStore } from "@/shared/stores/userStore";
import DividerWithText from "@/shared/components/DividerWithText";
import GoogleLoginButton from "../../shared/components/GoogleLoginButton";
import CustomAvatar from "../home/CustomAvatar.component";
import { Input } from "@/shared/components/shadcn-ui/Input";
import { MAX_LENGHT_OF_NICKNAME } from "@/shared/constants";
import GoogleLogoutButton from "@/shared/components/GoogleLogoutButton";
import { useTranslation } from "react-i18next";

type PlayerInfomationProps = {
  nickname: string;
  setNickname: (nickname: string) => void;
};


const PlayerInfomation = ({ nickname, setNickname }: PlayerInfomationProps) => {
  const { user } = useUserStore();
  const { t } = useTranslation();

  const numberOfCharactersLeft = MAX_LENGHT_OF_NICKNAME - nickname.length;
  return (
    <div className="relative flex flex-col items-center justify-center gap-5">
      <p className="text-xl font-medium bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text text-transparent ">
        <strong>{t("WaitingRoom.yourInfoLabel")}</strong>
      </p>
      <div className="relative w-fit">
        <CustomAvatar />
        <GoogleLogoutButton />
      </div>
      <div className="relative">
        <Input
          className={
            "font-bold text-lg border-primaryTextColor border-2 h-12 rounded-xl pr-10"
          }
          value={nickname}
          maxLength={MAX_LENGHT_OF_NICKNAME}
          onChange={(e) => setNickname(e.target.value)}
        />
        <span className="absolute text-[10px] text-slate-400 top-1/2 -translate-y-1/2 right-2">
          {numberOfCharactersLeft} {t("InputCharLeft")}
        </span>

      </div>
      {user?.is_guest && (
        <>
          <DividerWithText
            className="px-7 2xl:mt-1"
            text={t("OrLabel")}
            dividerClassname="text-red-400"
            textClassname="2xl:text-md w-16 h-16 2xl:w-20 2xl:h-20 flex items-center justify-center border-2 rounded-full font-bold text-textBlueColor"
          />

          <div className="flex items-center justify-center gap-2 mb-2 mt-2 2xl:mt-5">
            <GoogleLoginButton />
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerInfomation;
