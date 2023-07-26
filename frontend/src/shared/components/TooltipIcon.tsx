import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/components/shadcn-ui/tooltip"
import { cn } from "@/shared/lib/utils"
import { LucideIcon } from "lucide-react"

type Props = {
    icon: LucideIcon
    text: string
    iconSize?: number
    onClick?: () => void
    iconClassName?: string
    tooltipClassName?: string
}

const TooltipIcon = (props: Props) => {

    const { icon: Icon, text, iconSize = 35, onClick = () => { }, iconClassName = "", tooltipClassName = "" } = props

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild onClick={onClick} className={cn("hover:opacity-80", iconClassName)}><Icon size={iconSize} /></TooltipTrigger>
                <TooltipContent asChild className={cn("bg-black/70 border-none rounded-xl text-white font-medium", tooltipClassName)}>
                    {text}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default TooltipIcon