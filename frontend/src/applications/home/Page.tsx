import BannerImg from "@/shared/assets/play-banner.png";
import SloganImg from "@/shared/assets/slogan.png";
import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import PlayForm from "./PlayForm.component";
import CustomAvatar from "./CustomAvatar.component";
import GoogleLoginButton from "./GoogleLoginButton";
import DividerWithText from "@/shared/components/DividerWithText";
import { useUserStore } from "@/shared/stores/userStore";

const Homepage = () => {

  const { user } = useUserStore()
  return (
    <MainLayout>
      <div className="w-full h-fit flex flex-col items-center justify-center">
        <Logo customClassname="max-md:mt-12"/>
        <img src={SloganImg} alt="" className="slogan-width mt-5 slogan-responsive " />

        <div className="w-[95%] h-full lg:w-[80%] lg:h-[70%] bg-white flex flex-col items-center mt-5 rounded-lg mb-5">
          <img src={BannerImg} className="my-5 max-md:hidden " />

          <div className="flex items-center gap-4 home-content-responsive">
            <CustomAvatar />
            <PlayForm />
          </div>

          {user?.is_guest && (
            <>
              <DividerWithText className="mt-10 px-24 lg:px-40" text="LOGIN" dividerClassname="text-red-400"
                textClassname="text-lg w-20 h-20 flex items-center justify-center border-2 rounded-full font-bold text-textBlueColor" />
              <div className="flex items-center justify-center gap-4 mt-10 mb-8">
                <GoogleLoginButton />
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Homepage;
