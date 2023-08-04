import {
  Card,
  CardContent,
  CardTitle,
} from "@/shared/components/shadcn-ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn-ui/avatar-shadcn";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type ThemeCardProps = {
  isSelected?: boolean;
  onClick: () => void;
  img: string;
  name: string;
  isOffical: boolean;
};

const ThemeCard = (props: ThemeCardProps) => {
  const { isSelected, onClick, img, name, isOffical } = props;

  return (
    <Card
      className={cn(
        "m-3 rounded-2xl hover:ring-[6px] hover:bg-[#F9FEFF] h-[200px] aspect-[3/4]",
        {
          "ring-[6px] ring-[#474DDA]": isSelected,
        }
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center gap-y-3">
        <Avatar className="h-[50%] w-[50%] mt-5 ring ring-offset-4 ring-slate-300">
          <AvatarImage src={img} className="object-cover w-full h-full" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-2 text-lg font-balsamiq">{name}</CardTitle>
        {isOffical && (
          <div className="flex text-sky-600 gap-x-1">
            <p className="text-xl font-balsamiq">Offical </p>
            <CheckCircle2 />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ThemeCard;
