import { Card, CardContent } from '@/common/components/ui/card'
import { AvatarFallback } from '@radix-ui/react-avatar'
import { cn } from '@/common/lib/utils'
import { Avatar, AvatarImage } from '@/common/components/ui/avatar-shadcn'

type AvatarCardProps = {
    isSelected?: boolean
    onClick: () => void
    img: string
}

const AvatarCard = (props: AvatarCardProps) => {
    const {isSelected, onClick, img} = props
    return ( 
        <Card onClick={onClick} className={cn('cursor-pointer hover:opacity-80', {'border-4 border-blue-400': isSelected})}>
            <CardContent className="p-0">
                <div className='flex items-center justify-center h-full w-full pb-6 '>
                    <Avatar className='h-[90%] w-[90%] mt-6'>
                        <AvatarImage src={img} />
                        <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                </div>
            </CardContent>
        </Card>
    )
}

export default AvatarCard
