import { Card, CardContent, CardTitle } from "@/shared/components/shadcn-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/shadcn-ui/avatar-shadcn";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type ThemeCardProps = {
    isSelected?: boolean;
    onClick: () => void;
    img: string;
    name: string;
};

const ThemeCard = (props: ThemeCardProps) => {
    const { isSelected, onClick, img, name } = props;

    return (
        <Card className={cn("m-3 rounded-2xl hover:ring-[6px] hover:bg-[#F9FEFF]", {
            "ring-[6px] ring-[#474DDA]": isSelected
        })}  onClick={onClick}>

            <CardContent className="flex flex-col items-center gap-y-3">
                <Avatar className="h-[50%] w-[50%] mt-5 ring ring-offset-4 ring-slate-300">
                    <AvatarImage src={img} />
                    <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
                <CardTitle className="font-balsamiq mt-2 text-lg">{name}</CardTitle>
                <div className="flex text-sky-600 gap-x-1">
                    <p className="text-xl font-balsamiq">Offical </p>
                    <CheckCircle2 />
                </div>


            </CardContent>
        </Card>

    )
}

export default ThemeCard;