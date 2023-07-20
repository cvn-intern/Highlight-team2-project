import LogoImg from "@/shared/assets/logo.png";
import { cn } from "@/shared/lib/utils";

type LogoProps = {
  customClassname?: string;
};

const Logo = ({ customClassname = "" }: LogoProps) => {
  return (
    <img src={LogoImg} alt="" className={cn("md:w-[380px] w-[200px]", customClassname)} />
  );
};

export default Logo;
