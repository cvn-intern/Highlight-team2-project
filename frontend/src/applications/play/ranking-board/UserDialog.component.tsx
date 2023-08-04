import { Button } from "@/shared/components/shadcn-ui/Button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/shared/components/shadcn-ui/Modal";
import { Label } from "@/shared/components/shadcn-ui/label";
import { Ban } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn-ui/avatar-shadcn";
import ProfileLabel from "@/shared/assets/profile-label.png";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  user: Participant | null;
  blockedIdArray: number[];
  setBlockedIdArray: React.Dispatch<React.SetStateAction<number[]>>;
  triggerRef: any
};

export function DialogDemo({ user, triggerRef }: Props) {
  const { socket } = useSocketStore();
  const { codeRoom } = useParams();

  const handleKick = () => {
    socket?.emit('kick', {
      codeRoom,
      userId: user?.id,
      nickname: user?.nickname,
    });

    socket?.off('kick');
    triggerRef?.current.click();
  }

  if (!user) return null;
  const { t } = useTranslation();

  return (
    <DialogContent className="sm:w-[425px]" >
      <DialogHeader>
        <div className="flex items-center justify-center gap-5 w-full">
          <img className="w-4/5 h-fit" src={ProfileLabel} alt="avatar" />
        </div>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center gap-5 w-full py-5">
        <Avatar className="flex items-center bg-yellow-300 w-1/3 h-auto rounded-full">
          <AvatarImage src={user.avatar} alt="avatar" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>

        <div className="flex items-center justify-center w-full">
          <Label
            htmlFor="name"
            className="text-lg font-medium text-truncate dark:text-white"
          >
            {user.nickname}
          </Label>
        </div>
      </div>
      <DialogFooter>
        <div className="flex flex-col items-center justify-center gap-5 w-full pb-4">
          <Button
            variant="destructive"
            className="rounded-l-full rounded-r-full ring-8 ring-black bg-red-700 hover:bg-red-600 text-white"
            onClick={handleKick}>
            <Ban
              size={24}
              color="#000"
              strokeWidth={4}
              className="mr-4"
            />
            {t("PlayingGame.rankingBoard.kickButton")}
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}