import { Avatar, AvatarImage } from '@/common/components/ui/avatar'
import { Card, CardContent } from '@/common/components/ui/card'
import { AvatarFallback } from '@radix-ui/react-avatar'
import React from 'react'
import AvatarImg from "@/common/assets/avatar.svg"
import { cn } from '@/common/lib/utils'

type AvatarCardProps = {
    isSelected?: boolean
    onClick: () => void
}

const AvatarCard = (props: AvatarCardProps) => {
    const {isSelected, onClick} = props

    return ( 
        <Card onClick={onClick} className={cn('cursor-pointer hover:opacity-80', {'border-4 border-blue-400': isSelected})}>
            <CardContent className="p-0">
                <div className='flex items-center justify-center h-full w-full pb-6 '>
                    <Avatar className='h-full w-full'>
                        <AvatarImage src={AvatarImg} />
                        <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                </div>
            </CardContent>
        </Card>
    )
}

export default AvatarCard