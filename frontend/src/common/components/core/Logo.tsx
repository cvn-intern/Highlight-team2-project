import LogoImg from "@/common/assets/logo.png"
import { cn } from '@/common/lib/utils'

type LogoProps = {
    className?: string
}

const Logo = ({className = ""}: LogoProps) => {
  return (
    <img src={LogoImg} alt="" className={cn("w-[380px]", className)} />
  )
}

export default Logo
