import AvatarHeader from '@/common/assets/avatar-header.png'
import { Button } from "@/common/components/ui/Button"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/common/components/ui/dialog"

import AvatarCard from './AvatarCard'


import { cn } from "@/common/lib/utils"
import { Check, Edit2 as EditIcon } from 'lucide-react'
import { useState } from 'react'
import { avatarImages } from '../constants'
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/Avatar'

type CustomAvatarProps = {
  customClassname?: string
}

const CustomAvatar = ({ }: CustomAvatarProps) => {
  const [avatarIndex, setAvatarIndex] = useState(0)
  const [selectedAvatar, setSelectedAvatar] = useState(avatarIndex)

  const handleConfirmAvatar = () => {
    setSelectedAvatar(avatarIndex)
  }

  const handleResetAvatarIndex = () => setAvatarIndex(selectedAvatar)

  return (
    <div className='relative'>
      <Avatar className='w-fit h-[200px]'>
        <AvatarImage className='w-[180px] object-contain' src={avatarImages[selectedAvatar]} />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className={cn('w-10 h-10 rounded-full bg-[#22A699] hover:bg-[#148378] p-0 border-black absolute right-0 top-5')}>
            <EditIcon fill="white" />
          </Button>
        </DialogTrigger>
        <DialogContent onCloseAutoFocus={handleResetAvatarIndex} onInteractOutside={handleResetAvatarIndex} className="flex-col flex items-center sm:max-w-[955px]">
          <DialogHeader>
            <DialogTitle className="text-5xl text-center text-headerTextColor mb-7">
              <img src={AvatarHeader} className='w-52' alt=""></img>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto h-96 w-full">
            <div className="grid grid-cols-5 gap-2 p-2 bg-gray-300">
              {avatarImages.map((img, index) => (
                <AvatarCard key={img} img={img} onClick={() => setAvatarIndex(index)} isSelected={index === avatarIndex} />
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogPrimitive.Close>
              <Button onClick={handleConfirmAvatar} type='submit' variant="opacityHover" className='gap-4 mt-2 rounded-full border-8 border-black font-black bg-[#FFE569] p-5'>
                <Check color="white" size={28} strokeWidth={4} />
                <p className="text-lg">
                  CONFIRM!
                </p>
              </Button>
            </DialogPrimitive.Close>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CustomAvatar
