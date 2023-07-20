import LogoImg from "@/shared/assets/logo.png";
import { cn } from "@/shared/lib/utils";

type LogoProps = {
  customClassname?: string;
};

const Logo = ({ customClassname = "" }: LogoProps) => {
  return (
    <img src={LogoImg} alt="" className={cn("w-[300px] 2xl:w-[380px]", customClassname)} />
  );
};

export default Logo;
