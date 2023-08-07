import Youtube from "@/shared/assets/youtube.png";
import Twitter from "@/shared/assets/twitter.png";
import Discord from "@/shared/assets/discord.png";
import LogoTeam from "@/shared/assets/logo-team.png";

const Footer = () => {
  return (
    <footer className="flex justify-between items-center w-[80%] mb-2">
      <div className="w-[15%] max-sm:w-[40%]">
        <img src={LogoTeam} />
      </div>
      <p className="max-sm:w-[50%] max-sm:text-sm text-white text-lg font-medium w-[80%] text-center">
        © Copyright 2023 Highlight. All rights reserved.
      </p>
      <div className="flex w-[13%] max-md:w-[30%] max-lg:w-[20%]">
        <i className="ml-4">
          <img
            src={Youtube}
            className="brightness-0 contrast-100 invert grayscale"
          />
        </i>
        <i className="ml-4">
          <img
            src={Twitter}
            className="brightness-0 contrast-100 invert grayscale"
          />
        </i>
        <i className="ml-4">
          <img
            src={Discord}
            className="brightness-0 contrast-100 invert grayscale"
          />
        </i>
      </div>
    </footer>
  );
};

export default Footer;
