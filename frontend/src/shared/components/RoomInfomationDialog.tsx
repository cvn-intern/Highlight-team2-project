import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/shadcn-ui/dialog";
import SettingIcon from "@/shared/assets/icons/setting-icon.png";
import TooltipIcon from "./TooltipIcon";
import { AlertCircle } from "lucide-react";
import { RoomType } from "../types/room";
import { useTranslation } from "react-i18next";

type RoomInfomationDialogProps = {
  roomInfo: RoomType
}

const RoomInfomationDialog = ({ roomInfo }: RoomInfomationDialogProps) => {
  const { t } = useTranslation()
  return (
    <Dialog>
      <DialogTrigger>
        <TooltipIcon icon={AlertCircle} text="Info" iconSize={28} />
      </DialogTrigger>
      <DialogContent className="max-w-[350px] sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="mb-8 text-4xl text-center text-transparent uppercase bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text">
            {t("PlayingGame.roomInfo")}
          </DialogTitle>
          <DialogDescription>
            <div className="p-3 bg-gradient-to-r from-[#BBD2C5] to-[#536976] w-fit mx-auto rounded-full border-4 border-black shadow-md">
              <img
                alt=""
                src={SettingIcon}
                className="object-cover w-32 h-32"
              />
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-[#334d50] font-semibold text-lg">{t("Theme.themeLabel")}:</p>
            <p className="text-xl font-bold text-transparent bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text capitalize">
              {roomInfo?.words_collection?.theme?.name}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-[#334d50] font-semibold text-lg">
              {t("Rounds")}
            </p>
            <p className="text-xl font-bold text-transparent bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text capitalize">
              {roomInfo?.number_of_round}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-[#334d50] font-semibold text-lg">
              {t("Language.languageLabel")}
            </p>
            <p className="text-xl font-bold text-transparent bg-gradient-to-r from-yellow-500 to-blue-500 bg-clip-text">
              {t("Language." + roomInfo?.language?.name.toLowerCase())}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default RoomInfomationDialog