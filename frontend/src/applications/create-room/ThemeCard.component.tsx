import { Card, CardContent, CardTitle } from "@/shared/components/shadcn-ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/shadcn-ui/avatar-shadcn";
import { CheckCircle2 } from "lucide-react";

type ThemeCardProps = {
    img: string;
};

const ThemeCard = (props: ThemeCardProps) => {
    const { img } = props;

    return (
        <Card className="m-4 rounded-2xl">

            <CardContent className="flex flex-col items-center gap-y-4">
                <Avatar className="h-[50%] w-[50%] mt-5">
                    <AvatarImage src={img} />
                    <AvatarFallback>Avatar</AvatarFallback>
                </Avatar>
                <CardTitle className="font-oxanium font-thin text-slate-400">Card Title</CardTitle>
                <div className="flex text-sky-600 gap-x-1">
                    <p className="text-lg  font-bakbak">Offical </p>
                    <CheckCircle2  />
                </div>


            </CardContent>
        </Card>

    )
}

export default ThemeCard;