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
import { Check, Edit2 as EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/shadcn-ui/avatar-shadcn";
import AvatarCard from "@/shared/components/AvatarCard";
import { useUserStore } from "@/shared/stores/userStore";
import userService from "@/shared/services/userService";
import useToaster from "@/shared/hooks/useToaster";
import { useTranslation } from "react-i18next";

const CustomAvatar = () => {
  const { user, setUser } = useUserStore();
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarIndex);
  const [avatarImages, setAvatarImages] = useState<Array<string>>([]);
  const { t } = useTranslation()

  const handleConfirmAvatar = async () => {
    try {
      setSelectedAvatar(avatarIndex);

      const { data } = await userService.updateUser({
        ...user,
        avatar: avatarImages[avatarIndex],
      });

      setUser(data);
    } catch (error) {
      useToaster({
        type: "error",
        message: "Confrim avatar failed!",
      })
    }
  };

  useEffect(() => {
    const getAvatarsDefault = async () => {
      try {
        const { data } = await userService.getAvatars();
        setAvatarImages(data);
      } catch (error) {
        useToaster({
          type: "error",
          message: "Get avatars failed!",
        })
      }
    };

    getAvatarsDefault();
  }, []);

  const handleResetAvatarIndex = () => setAvatarIndex(selectedAvatar);

  return (
    <div className="relative">
      <Avatar className="w-fit md:h-[150px] xl:h-[180px] h-[120px]">
        <AvatarImage
          className="object-cover w-full h-full"
          src={user?.avatar ?? avatarImages[selectedAvatar]}
        />
        <AvatarFallback>Avatar</AvatarFallback>
      </Avatar>

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
              <p className="hidden lg:block text-7xl mx-auto font-serif text-headerBlueColor">
                {t("AvatarLabel")}
              </p>
            </DialogTitle>
          </DialogHeader>
          <div className="w-full overflow-y-auto h-96">
            <div className="grid grid-cols-2 gap-2 p-2 bg-gray-300 md:grid-cols-5">
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
                <p className="text-lg">{t("CustomAvatar.confirmButton")}!</p>
              </Button>
            </DialogPrimitive.Close>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomAvatar;
