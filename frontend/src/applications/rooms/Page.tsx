import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/shadcn-ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_LENGHT_OF_SEARCH } from "@/shared/constants";
import { Input } from "@/shared/components/shadcn-ui/Input";
import { useSocketStore } from "@/shared/stores/socketStore";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { Book, DoorOpen, Globe, Search, Triangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/shadcn-ui/select";
import Logo from "@/shared/components/Logo";
import ListOfRoom from "./ListOfRoom.component";
import SloganImg from "@/shared/assets/slogan.png";
import useToaster from "@/shared/hooks/useToaster";
import MainLayout from "@/shared/components/MainLayout";
import roomService from "@/shared/services/roomService";
import RoomsTitle from "@/shared/assets/rooms-title.png";
import themeService from "@/shared/services/themeService";
import ControllerIcon from "@/shared/assets/controller-icon.svg";
import useDisableBackButton from "@/shared/hooks/useDisableBackButton";
import { cn } from "@/shared/lib/utils";

interface Theme {
  id: number;
  name: string;
  thumbnail: string;
}

const formSchema = z.object({
  searchInput: z.string().trim().max(50),
  theme: z.string(),
  language: z.string({
    required_error: "Please select an language.",
  }),
});

const RoomsPage = () => {
  const navigate = useNavigate();
  const [themesData, setThemesData] = useState<Theme[]>([]);
  const [roomFilterData, setRoomFilterData] = useState<roomList[]>([]);
  const [selectCodeRoom, setSelectCodeRoom] = useState<string>("");
  const { socket } = useSocketStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchInput: "",
      theme: "all",
      language: "en",
    },
  });

  useEffect(() => {
    const fetchThemesData = async () => {
      try {
        const { data } = await themeService.getThemes();
        setThemesData(data);
      } catch (error) {
        useToaster({
          type: "error",
          message: "Error fetching themes data!",
        });
      }
    };

    fetchThemesData();
    handleSubmit(form.getValues());
  }, []);

  const handleBackButton = () => {
    navigate("/");
  };

  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    try {
      const { data: roomFilterData } = await roomService.filterRooms(
        formData.theme,
        formData.language,
        formData.searchInput
      );
      setRoomFilterData(roomFilterData);
    } catch (error) {
      useToaster({
        type: "error",
        message: "Error fetching rooms data!",
      });
    }
  };

  const handleDropdownChange = () => {
    handleSubmit(form.getValues());
  };

  const handleJoinRoom = async () => {
    try {
      if (selectCodeRoom) {
        socket?.emit("join-room", selectCodeRoom);
        navigate("/" + selectCodeRoom, { state: { wait: false }, replace: false });
      }
    } catch (error) {
      useToaster({
        type: "error",
        message: "Join room failed!",
      });
    }
  };

  useDisableBackButton();

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full">
        <Logo customClassname="max-md:mt-12" />
        <img
          src={SloganImg}
          alt="Slogan"
          className="slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5"
        />
        <div className="relative bg-white flex flex-col items-center mb-5 w-[92%] xl:w-3/4 2xl:w-3/5 min-h-[70vh] mt-5 rounded-2xl pb-5">
          <button
            onClick={handleBackButton}
            className="left-1 mx-5 md:mr-10 absolute top-8 md:left-10"
          >
            <Triangle
              size={40}
              strokeWidth={2.5}
              className="-rotate-90 fill-[#f7b733] hover:opacity-80"
            />
          </button>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex flex-col md:flex-row items-center justify-between my-3"
            >
              <div className="flex items-center ml-32">
                <FormField
                  control={form.control}
                  name="searchInput"
                  render={({ field }) => {
                    return (
                      <FormItem className="max-lg:flex-col text-slate-400">
                        <div className="relative flex flex-col">
                          <FormControl className="relative">
                            <>
                              <Input
                                {...field}
                                className={
                                  "font-bold text-lg border-primaryTextColor border-2 h-12 rounded-xl pr-10"
                                }
                                maxLength={MAX_LENGHT_OF_SEARCH}
                              />
                              <Search className="absolute w-6 h-6 top-1/2 -translate-y-1/2 right-2" />
                            </>
                          </FormControl>
                          <FormMessage className="text-xs absolute bottom-[-20px] 2xl:bottom-[-32px] left-0 w-[140%] 2xl:w-[120%] leading-4" />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <img
                src={RoomsTitle}
                className="hidden ml-10 lg:block scale-90 md:scale-100"
              />

              <div className="flex items-center w-fit pl-10 mt-5 md:mt-0 lg:pl-0 lg:pr-5 mx-auto justify-between">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="max-lg:flex-col md:items-center text-slate-400 mr-10">
                      <FormLabel className="flex items-center gap-5">
                        <div>
                          <Book size={28} strokeWidth={2} color={"#22A699"} />
                        </div>
                        <div className="mr-3 text-lg font-bold text-primaryTextColor">
                          THEMES
                        </div>
                      </FormLabel>
                      <div className="relative flex flex-col">
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleDropdownChange();
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full h-12 text-lg font-bold border-none focus:ring-0 focus:ring-offset-0 rounded-xl">
                              <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="text-lg font-bold">
                              <SelectItem key={0} value="all">ALL</SelectItem>
                              {themesData?.map((theme) => (
                                <SelectItem key={theme.id} value={theme.name}>{theme.name.toUpperCase()}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="  max-lg:flex-col md:items-center text-slate-400 mr-10">
                      <FormLabel className="flex items-center gap-3 ">
                        <div>
                          <Globe size={28} strokeWidth={2} color={"#22A699"} />
                        </div>
                        <div className="mr-3 text-lg font-bold text-primaryTextColor">
                          LANGUAGE
                        </div>
                      </FormLabel>
                      <div className="relative flex flex-col">
                        <FormControl>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleDropdownChange();
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full h-12 text-lg font-bold border-none focus:ring-0 focus:ring-offset-0 rounded-xl">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent className="text-lg font-bold border-none ">
                              <SelectItem value="en">English (EN)</SelectItem>
                              <SelectItem value="vi">Vietnamese (VN)</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>

          <div className="flex flex-col items-center justify-center h-full w-11/12 gap-4 mb-2 bg-white home-content-responsive p-0 flex-1 overflow-auto">
            <ListOfRoom roomFilter={roomFilterData} selectCodeRoom={selectCodeRoom} setSelectCodeRoom={setSelectCodeRoom} />
          </div>
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="opacityHover"
              className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-gradient-to-r from-[#005AA7] to-[#FFFDE4] p-5"
            // onClick={handleJoinRoom}
            >
              <DoorOpen />
              <p>NEW ROOM</p>
            </Button>
            <Button
              type="submit"
              variant="opacityHover"
              className={cn(
                "gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black p-5",
                selectCodeRoom
                  ? "bg-gradient-to-r from-[#f7b733] to-[#E4E5E6]"
                  : "bg-gradient-to-r from-[#bdc3c7] to-[#2c3e50]"
              )}
              onClick={handleJoinRoom}
            >
              <img src={ControllerIcon} alt="" className="w-[25%]" />
              <p>PLAY</p>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout >
  );
};

export default RoomsPage;