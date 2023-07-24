import { useUserStore } from "@/shared/stores/userStore";
import DividerWithText from "@/shared/components/DividerWithText";
import GoogleLoginButton from "../home/GoogleLoginButton";
import CustomAvatar from "../home/CustomAvatar.component";
import { Input } from "@/shared/components/shadcn-ui/Input";

type PlayerInfomationProps = {
  nickname: string
  setNickname: (nickname: string) => void
};

const PlayerInfomation = ({nickname,setNickname}: PlayerInfomationProps) => {
  const { user } = useUserStore();

  return (
    <div className="relative flex flex-col items-center justify-center gap-5">
      <p className="text-xl font-medium text-blue-500 ">
        <strong>YOUR INFORMATION</strong>
      </p>
      <div className="relative w-fit">
        <CustomAvatar />
      </div>
      <Input
        className={
          "font-bold text-lg border-primaryTextColor border-2 h-12 rounded-xl pr-10 w-[60%]"
        }
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      {user?.is_guest && (
        <>
          <DividerWithText
            className="px-10 2xl:mt-5 md:px-12 lg:px-40"
            text="LOGIN"
            dividerClassname="text-red-400"
            textClassname="2xl:text-lg w-16 h-16 2xl:w-20 2xl:h-20 flex items-center justify-center border-2 rounded-full font-bold text-textBlueColor"
          />

          <div className="flex items-center justify-center gap-4 mb-10 mt-7 2xl:mt-10">
            <GoogleLoginButton />
          </div>
        </>
      )}

    </div>
  );
};

export default PlayerInfomation;
