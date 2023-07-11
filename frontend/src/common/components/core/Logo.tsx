import React from 'react'
import LogoImg from "@/common/assets/logo.png"
import { cn } from '@/common/lib/utils'

type Props = {
    customClassname?: string
}

const Logo = ({customClassname = ""}: Props) => {
  return (
    <img src={LogoImg} alt="" className={cn("w-[380px]", customClassname)} />
  )
}

export default Logo