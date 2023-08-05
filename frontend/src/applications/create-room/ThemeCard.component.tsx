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
import { CheckCircle2, Pencil } from "lucide-react";
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
        "m-3 rounded-2xl hover:ring-[6px] hover:bg-[#F9FEFF] w-full aspect-[3/4] relative group cursor-pointer",
        {
          "ring-[6px] ring-[#474DDA]": isSelected,
        }
      )}
      onClick={onClick}
    >
      {!isOffical && (
        <div className="absolute inset-0 transition-all duration-200 ease-linear bg-blue-400 opacity-0 bg-opacity-30 group-hover:opacity-100">
          <button className="absolute left-1/2 -translate-x-1/2 bottom-6 flex items-center gap-2 py-2 px-3 bg-[#474DDA] text-sm uppercase text-white font-semibold rounded-[4px]">
            <Pencil size={16} />
            <span>Edit</span>
          </button>
        </div>
      )}
      <CardContent className="flex flex-col items-center gap-y-3">
        <Avatar className="h-[50%] w-[50%] mt-5 ring ring-offset-4 ring-slate-300">
          <AvatarImage src={img} className="object-cover w-full h-full" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <CardTitle className="mt-2 text-lg text-center font-balsamiq">
          {name}
        </CardTitle>
        {isOffical && (
          <div className="flex text-sky-600 gap-x-1">
            <p className="text-xl font-balsamiq">Offical </p>
            <CheckCircle2 />
          </div>
        )}
        {!isOffical && (
          <p className="text-lg font-medium leading-6 text-center text-gray-400 group-hover:hidden">
            Created by you
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ThemeCard;
