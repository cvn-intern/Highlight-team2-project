import BannerImg from "@/shared/assets/play-banner.png";
import SloganImg from "@/shared/assets/slogan.png";
import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import PlayForm from "./PlayForm.component";
import CustomAvatar from "./CustomAvatar.component";
import GoogleLoginButton from "./GoogleLoginButton";
import DividerWithText from "@/shared/components/DividerWithText";

const Homepage = () => {
  return (
    <MainLayout>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Logo />
        <img src={SloganImg} alt="" className="w-[300px] mt-5" />

        <div className="w-[80%] h-[70%] bg-white flex flex-col items-center mt-5 rounded-lg">
          <img src={BannerImg} className="my-5" />

          <div className="flex items-center gap-24">
            <CustomAvatar />
            <PlayForm />
          </div>

          <DividerWithText className="mt-10 px-24 lg:px-40" text="LOGIN" dividerClassname="text-red-400"
            textClassname="text-lg w-20 h-20 flex items-center justify-center border-2 rounded-full font-bold text-textBlueColor" />

          <div className="flex items-center justify-center gap-4 mt-10">
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Homepage;
