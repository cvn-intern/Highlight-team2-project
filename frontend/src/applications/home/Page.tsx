import SloganImg from "@/shared/assets/slogan.png";
import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import PlayForm from "./PlayForm.component";
import CustomAvatar from "./CustomAvatar.component";
import GoogleLoginButton from "@/shared/components/GoogleLoginButton";
import DividerWithText from "@/shared/components/DividerWithText";
import { useUserStore } from "@/shared/stores/userStore";
import GoogleLogoutButton from "@/shared/components/GoogleLogoutButton";
import { useTranslation } from "react-i18next";

const Homepage = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full">
        <Logo customClassname="max-lg:mt-12" />
        <img
          src={SloganImg}
          alt=""
          className="slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5"
        />

        <div className="lg:w-[80%] lg:h-[70%] min-h-[50vh] bg-white flex flex-col items-center mb-5 w-[80%] h-[70%] mt-5 rounded-2xl p-8">
          {/* <img
            src={BannerImg}
            className="mt-5 mb-2 2xl:my-5 w-[500px] max-lg:hidden"
          /> */}
          <p className="text-7xl mx-auto mb-10 font-coiny bg-gradient-to-r from-[#f7b733] to-[#0575E6] text-transparent bg-clip-text pt-5">
            {t("PlayLabel")}
          </p>

          <div className="flex items-center gap-4 mb-8 md:gap-10 xl:gap-20 home-content-responsive">
            <div className="flex flex-col">
              <CustomAvatar />
              <GoogleLogoutButton />
            </div>
            <PlayForm />
          </div>

          {user?.is_guest && (
            <>
              <DividerWithText
                className="px-10 2xl:mt-10 md:px-24 lg:px-40"
                text={t("OrLabel")}
                dividerClassname="text-red-400"
                textClassname="2xl:text-lg w-16 h-16 2xl:w-20 2xl:h-20 flex items-center justify-center border-2 rounded-full font-bold text-textBlueColor"
              />

              <div className="flex items-center justify-center gap-4 mb-10 mt-7 2xl:mt-10">
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
