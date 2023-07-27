import { Button } from "@/shared/components/shadcn-ui/Button";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/shared/components/shadcn-ui/Modal";
import { Label } from "@/shared/components/shadcn-ui/label";
import { Ban, ThumbsDown } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn-ui/avatar-shadcn";
import ProfileLabel from "@/shared/assets/profile-label.png";

type Props = {
  user: Participant | null;
  blockedIdArray: number[];
  setBlockedIdArray: React.Dispatch<React.SetStateAction<number[]>>;
};

export function DialogDemo({ user, blockedIdArray, setBlockedIdArray }: Props) {

  function handleBlockClick(): void {
    if(!user) return

    const foundBlockedIdIndex = blockedIdArray.findIndex(id => id === user.id);

    let tempArray = [...blockedIdArray]

    if(foundBlockedIdIndex < 0) {
      tempArray.push(user.id)
      setBlockedIdArray(tempArray)
      return
    }

    tempArray = tempArray.filter(id => id !== user.id)
    setBlockedIdArray(tempArray)
  }

  const isUserBlocked = blockedIdArray.findIndex(id => id === user?.id) >= 0;

  if (!user) return null;

  return (
    <DialogContent className="sm:w-[425px]">
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
          <div className="flex items-center justify-center w-full">
            <Button className="rounded-l-full rounded-r-full ring-8 ring-black bg-yellow-600 hover:bg-yellow-200 text-white">
              <ThumbsDown
                size={24}
                color="#000"
                strokeWidth={4}
                className="mr-1"
              />
              VOTE KICK
            </Button>
          </div>
          <div className="flex items-center justify-center w-full">
            {!isUserBlocked && (
              <Button
                variant="destructive"
                className="rounded-l-full rounded-r-full ring-8 ring-black bg-red-700 hover:bg-red-600 text-white"
                onClick={() => handleBlockClick()}
              >
                <Ban size={24} color="#000" strokeWidth={4} className="mr-5" />
                BLOCKS
              </Button>)}
            {isUserBlocked && (
              <Button
                variant="destructive"
                className="rounded-l-full rounded-r-full ring-8 ring-black bg-red-700 hover:bg-red-600 text-white"
                onClick={() => handleBlockClick()}
              >
                <Ban size={24} color="#000" strokeWidth={4} className="mr-1" />
                UNBLOCKS
              </Button>)}
          </div>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}