import LogoImg from "@/shared/assets/logo.png";
import { cn } from "@/shared/lib/utils";

type LogoProps = {
  customClassname?: string;
};

const Logo = ({ customClassname = "" }: LogoProps) => {
  return (
    <img src={LogoImg} alt="" className={cn("md:w-[300px] 2xl:w-[380px] w-[250px]", customClassname)} />
  );
};

export default Logo;
