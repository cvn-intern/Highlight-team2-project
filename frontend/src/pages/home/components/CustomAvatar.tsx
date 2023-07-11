import AvatarImg from "@/common/assets/avatar.svg"
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/Avatar'
import { Button } from "@/common/components/ui/Button"
import { cn } from "@/common/lib/utils"
import { Edit2 } from 'lucide-react'

type Props = {
    customClassname?: string
}

const CustomAvatar = ({customClassname = ""}: Props) => {
  return (
    <div className='relative'>
    <Avatar className='w-[200px] h-[200px]'>
      <AvatarImage src={AvatarImg} />
      <AvatarFallback>CN</AvatarFallback>

    </Avatar>
    <Button variant="outline" className={cn('w-10 h-10 rounded-full bg-[#22A699] p-0 border-black absolute right-5 top-10')}>
      <Edit2 fill="white" />
    </Button>
  </div>
  )
}

export default CustomAvatar