/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import ThemeCard from "./ThemeCard.component";
import useToaster from "@/shared/hooks/useToaster";
import DoorIcon from "@/shared/assets/door-icon.svg";
import roomService from "@/shared/services/roomService";
import SettingRoomForm from "./SettingRoomForm.component";
import { z } from "zod";
import { LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSocketStore } from "@/shared/stores/socketStore";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { ScrollArea } from "@/shared/components/shadcn-ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { DEFAULT_ROOM_TIME } from "@/shared/constants";
import { useTranslation } from "react-i18next";
import { useQueryWordsCollections } from "@/shared/hooks/useQueryWordsCollections";
import Spinner from "@/shared/components/Spinner";
import { cn } from "@/shared/lib/utils";
import { useUserStore } from "@/shared/stores/userStore";

const DEFAULT_ROUND = "3";
const DEFAULT_PLAYER = "8";
const DEFAULT_THEME = 1;
const DEFAULT_LANGUAGE = "all";

const formSchema = z.object({
  players: z.string().nonempty(),
  visible: z.boolean(),
  round: z.string().nonempty(),
  theme: z.number(),
  language: z.string().nonempty(),
});

const CreateRoomsContent = () => {
  const { user } = useUserStore();
  const [type, setType] = useState(0);
  const { t } = useTranslation();
  const [languageCode, setLanguageCode] = useState("all");
  const { data, isLoading, isFetching } = useQueryWordsCollections({
    type,
    language_code: languageCode,
  });
  const wordsCollections = data ? data.data : [];
  const [selectedThemeId, setSelectedThemeId] = useState(DEFAULT_THEME);
  const navigate = useNavigate();
  const { socket } = useSocketStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      players: DEFAULT_PLAYER,
      round: DEFAULT_ROUND,
      visible: false,
      theme: DEFAULT_THEME,
      language: DEFAULT_LANGUAGE,
    },
  });

  const handleSubmit = () => {
    return handleCreateRoom();
  };

  const handleCreateRoom = async () => {
    try {
      const players = parseInt(form.getValues("players"));
      const round = parseInt(form.getValues("round"));
      const visible = form.getValues("visible");
      const theme = selectedThemeId;

      const { data: createRoomResponse } = await roomService.createRoom({
        max_player: players,
        words_collection_id: theme,
        number_of_round: round,
        time_per_round: DEFAULT_ROOM_TIME,
        is_public: visible,
      });
      handleJoinNewCreateRoom(createRoomResponse.code_room);
    } catch (error: any) {
      error;
      useToaster({
        type: "error",
        message:
          error.response.data.response ||
          t("toastMessage.error.somethingWentWrong"),
      });
    }
  };

  const handleJoinNewCreateRoom = async (codeRoom: string) => {
    try {
      if (codeRoom) {
        socket?.emit("join-room", codeRoom);
        navigate("/" + codeRoom, {
          state: { wait: false },
          replace: false,
        });
        useToaster({
          type: "success",
          message: t("toastMessage.success.createRoom"),
        });
      }
    } catch (error) {
      useToaster({
        type: "error",
        message: t("toastMessage.error.joinRoom"),
      });
    }
  };

  const handleSubmitClick = () => {
    document.getElementById("submitBtn")?.click();
  };
  const handleExitButton = () => {
    navigate("/");
  };
  const handleCreateThemeClick = () => {
    if (user?.is_guest) {
      useToaster({
        type: "warning",
        message: t("toastMessage.warning.guestUser"),
      });
      return;
    }
    navigate("/rooms/theme");
  };

  return (
    <>
      <div className="flex max-xl:flex-col justify-center items-center xl:w-[90%] xl:h-[80%] xl:bg-gray-300 rounded-2xl mt-5 xl:p-6 gap-x-2">
        <div className="xl:w-[42%] w-full h-full border rounded-2xl bg-white text-center">
          <div className="flex flex-col border p-5 m-5 rounded-xl place-content-center h-[91.5%]">
            <SettingRoomForm
              handleSubmit={handleSubmit}
              form={form}
              languageCode={languageCode}
              setLanguageCode={setLanguageCode}
            />
          </div>
        </div>

        <div className="flex flex-col items-center w-full xl:h-full gap-y-2 ">
          <div className="flex flex-col justify-between w-full gap-2 p-5 mt-1 bg-white sm:flex-row gap-x-5 rounded-2xl">
            <p className="mt-1 text-xl font-coiny md:text-2xl text-headerBlueColor">
              {t("Theme.themeLabel")}
            </p>
            <div className="flex gap-x-2 max-md:flex-col max-md:gap-y-2">
              <Select
                value={type.toString()}
                onValueChange={(value) => {
                  setType(parseInt(value));
                }}
              >
                <SelectTrigger className="sm:w-[200px] w-full rounded-xl md:text-xl font-bold border-2 text-slate-500">
                  <SelectValue placeholder="Themes Filter" />
                </SelectTrigger>
                <SelectContent className="font-semibold rounded-xl md:text-xl text-slate-500">
                  <SelectItem value={"0"}>{t("Theme.all")}</SelectItem>
                  <SelectItem value={"1"}>{t("Theme.yourTheme")}</SelectItem>
                  <SelectItem value={"2"}>
                    {t("Theme.officialTheme")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="submit"
                variant="opacityHover"
                className={cn(
                  "gap-4 rounded-[10px] font-black w-full max-md:w-full sm:w-[200px]",
                  !user?.is_guest
                    ? "bg-headerBlueColor"
                    : "bg-gradient-to-r from-[#bdc3c7] to-[#2c3e50]"
                )}
                onClick={handleCreateThemeClick}
              >
                <p className="text-base font-bold text-white md:text-lg">
                  {t("Theme.createTheme")}
                </p>
              </Button>
            </div>
          </div>
          {!isFetching && !isLoading && wordsCollections && (
            <ScrollArea className="relative w-full h-full px-2 py-5 bg-white border rounded-2xl overflow-x-scoll max-h-[400px]">
              <div className="grid items-stretch grid-cols-2 row-auto gap-4 pr-6 lg:grid-cols-3 2xl:grid-cols-3">
                {wordsCollections.map((item) => {
                  return (
                    <ThemeCard
                      key={item.id}
                      wordsCollectionId={item.id}
                      name={item.theme_name.toUpperCase()}
                      img={item.theme_thumbnail}
                      onClick={() => setSelectedThemeId(item.id)}
                      isSelected={item.id === selectedThemeId}
                      isOffical={item.is_created_by_system}
                    />
                  );
                })}
              </div>
            </ScrollArea>
          )}
          {(isFetching || isLoading) && (
            <div className="flex w-full h-full bg-white flexCenter rounded-2xl">
              <Spinner />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row xl:gap-3 xl:my-5 mt-5 gap-x-2">
        <Button
          type="submit"
          variant="opacityHover"
          className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-[#C13A3A] py-5 w-[200px] max-md:w-[150px]"
          onClick={handleExitButton}
        >
          <LogOut strokeWidth={3} size={32} />
          <p className="md:text-lg text-sm">{t("ExitButton")}</p>
        </Button>
        <Button
          type="submit"
          variant="opacityHover"
          onClick={handleSubmitClick}
          className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-[#22A699] py-5 w-[200px] max-md:w-[150px]"
        >
          <img src={DoorIcon} alt="" className="w-[18%]" />
          <p className="md:text-lg text-sm">{t("RoomList.newRoomButton")}</p>
        </Button>
      </div>
    </>
  );
};

export default CreateRoomsContent;
