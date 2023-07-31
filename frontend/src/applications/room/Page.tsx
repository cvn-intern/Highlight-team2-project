import ControllerIcon from "@/shared/assets/controller-icon.svg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/shadcn-ui/form";
import RoomsTitle from "@/shared/assets/rooms-title.png";
import SloganImg from "@/shared/assets/slogan.png";
import Logo from "@/shared/components/Logo";
import MainLayout from "@/shared/components/MainLayout";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useUserStore } from "@/shared/stores/userStore";
import { Book, DoorOpen, Globe, Search, Triangle, User2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListOfRoom from "./ListOfRoom.component";
import { MAX_LENGHT_OF_NICKNAME } from "@/shared/constants";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/shared/components/shadcn-ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/shadcn-ui/select";
import themeService from "@/shared/services/themeService";

const formSchema = z.object({
  searchInput: z.string().trim().min(2).max(50),
  theme: z.string(),
  language: z.string({
    required_error: "Please select an language.",
  }),
});

const Room = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useState();
  const [formAction, setFormAction] = useState<"new-room" | "join-room">(
    "join-room"
  );

  const handleBackButton = () => {
    navigate("/");
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchInput: "",
      theme: "all",
      language: "en",      
    },
  });

  const handleSubmit = (_: z.infer<typeof formSchema>) => {
    if (formAction === "join-room") return null;
  };

  useEffect(() => {
    (
      async () => {
        const { data: themesData } = await themeService.getThemes();
        setTheme(themesData)
      }
    )()
  })

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full">
        <Logo customClassname="max-md:mt-12" />
        <img
          src={SloganImg}
          alt=""
          className="slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5"
        />

        <div className="relative bg-white flex flex-col items-center mb-5 w-3/5 min-h-[70vh] mt-5 rounded-2xl pb-5">

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full flex items-center justify-between my-3"
            >
              <div className="flex items-center">
                <button
                  onClick={handleBackButton}
                  className="mx-5 md:mr-10"
                >
                  <Triangle
                    size={40}
                    strokeWidth={2.5}
                    className="-rotate-90 fill-[#f7b733] hover:opacity-80"
                  />
                </button>
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
                                maxLength={MAX_LENGHT_OF_NICKNAME}
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
              />

              <div className="flex items-center mr-5">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className=" max-lg:flex-col md:items-center text-slate-400 mr-10">
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
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full h-12 text-lg font-bold border-2 border-primaryTextColor rounded-xl">
                              <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="text-lg font-bold border-2 border-primaryTextColor">
                              {themesData?.map((theme) => (
                                <SelectItem value={theme.id}>{theme.name}</SelectItem>
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
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full h-12 text-lg font-bold border-2 border-primaryTextColor rounded-xl">
                              <SelectValue placeholder="Language" />
                            </SelectTrigger>
                            <SelectContent className="text-lg font-bold border-2 border-primaryTextColor">
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

          <div className="flex flex-col items-stretch justify-center h-full w-11/12 gap-4 p-8 mb-2 bg-white home-content-responsive md:p-0 flex-1 overflow-auto">
            <ListOfRoom />
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
              className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-gradient-to-r from-[#f7b733] to-[#E4E5E6] p-5"
            // onClick={handleJoinRoom}
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

export default Room;
