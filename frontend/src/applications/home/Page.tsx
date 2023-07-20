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
        <Logo customClassname="max-md:mt-12" />
        <img src={SloganImg} alt="" className="slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5" />

        <div className="lg:w-[80%] lg:h-[70%] bg-white flex flex-col items-center mb-5 w-[80%] h-[70%]   mt-5 rounded-2xl">
          <img src={BannerImg} className="mt-5 mb-2 2xl:my-5 w-[500px] max-md:hidden" />

          <div className="flex items-center gap-4 home-content-responsive">
            <CustomAvatar />
            <PlayForm />
          </div>

          {user?.is_guest && (
            <>
              <DividerWithText className="mt-10 px-24 lg:px-40" text="LOGIN" dividerClassname="text-red-400"
                textClassname="text-lg w-20 h-20 flex items-center justify-center border-2 rounded-full font-bold text-textBlueColor" />
              <div className="flex items-center justify-center gap-4 mt-10 mb-8">
                <DividerWithText className="mt-8 2xl:mt-10 px-24 lg:px-40" text="LOGIN" dividerClassname="text-red-400"
                  textClassname="2xl:text-lg w-16 h-16 2xl:w-20 2xl:h-20 flex items-center justify-center border-2 rounded-full font-bold text-textBlueColor" />

                <div className="flex items-center justify-center gap-4 mt-7 2xl:mt-10">
                  <GoogleLoginButton />
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </MainLayout>
  );
};

export default Homepage;
