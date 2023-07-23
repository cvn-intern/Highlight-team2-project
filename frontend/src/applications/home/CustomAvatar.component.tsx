import AvatarHeader from "@/shared/assets/avatar-header.png";
import { Button } from "@/shared/components/shadcn-ui/Button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/shadcn-ui/dialog";
import { cn } from "@/shared/lib/utils";
import { Check, Edit2 as EditIcon, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn-ui/avatar-shadcn";
import AvatarCard from "./AvatarCard.component";
import { useUserStore } from "@/shared/stores/userStore";
import userService from "@/shared/services/userService";
import authService from "@/shared/services/authService";
import JWTManager from "@/shared/lib/jwt";

const CustomAvatar = () => {
  const { user, setUser, deleteUser } = useUserStore()
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarIndex);
  const [avatarImages, setAvatarImages] = useState<Array<string>>([]);

  const handleConfirmAvatar = async () => {
    try {
      setSelectedAvatar(avatarIndex);

      const { data } = await userService.updateUser({
        ...user,
        avatar: avatarImages[avatarIndex],
      })

      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getAvatarsDefault = async () => {
      try {
        const { data } = await userService.getAvatars();
        setAvatarImages(data);
      } catch (error) {
        console.log(error);
      }
    }

    getAvatarsDefault();
  }, [])

  const handleResetAvatarIndex = () => setAvatarIndex(selectedAvatar);

  const handleLogout = async () => {
    try {
      await authService.logout();

      JWTManager.deleteToken();
      deleteUser();
      window.location.reload();
    } catch(error) {
      console.log(error);
    }
  }
  return (
    <div className="relative">
      <Avatar className="w-fit md:h-[180px] h-[120px]">
        <AvatarImage
          className="w-full h-full object-cover"
          src={user?.avatar ?? avatarImages[selectedAvatar]}
        />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>
      {!user?.is_guest && (
        <Button className="flex items-center gap-2 bg-blue-700 h-9 mx-auto mt-2 hover:bg-red-400" style={{ borderRadius: '5px' }} onClick={handleLogout}>
          <LogOut />
          <span>LOG OUT</span>
        </Button>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className={cn(
              "md:w-10 md:h-10 w-8 h-8 rounded-full bg-[#22A699] hover:bg-[#148378] p-0 border-black absolute right-0 md:top-5 top-4  "
            )}
          >
            <EditIcon fill="white" />
          </Button>
        </DialogTrigger>
        <DialogContent
          onCloseAutoFocus={handleResetAvatarIndex}
          onInteractOutside={handleResetAvatarIndex}
          className="flex-col flex items-center max-w-[94vw] md:max-w-[955px] rounded-xl"
        >
          <DialogHeader>
            <DialogTitle className="text-5xl text-center text-headerTextColor mb-7">
              <img src={AvatarHeader} className="w-44 md:w-52" alt=""></img>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto h-96 w-full">
            <div className="grid md:grid-cols-5 grid-cols-2 gap-2 p-2 bg-gray-300">
              {avatarImages.map((img, index) => (
                <AvatarCard
                  key={img}
                  img={img}
                  onClick={() => setAvatarIndex(index)}
                  isSelected={index === avatarIndex}
                />
              ))}
            </div>
          </div>
          <DialogFooter>
            <DialogPrimitive.Close>
              <Button
                onClick={handleConfirmAvatar}
                type="submit"
                variant="opacityHover"
                className="gap-4 mt-2 rounded-full border-8 border-black font-black bg-[#FFE569] p-5"
              >
                <Check color="white" size={28} strokeWidth={4} />
                <p className="text-lg">CONFIRM!</p>
              </Button>
            </DialogPrimitive.Close>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomAvatar;
