import { Button } from "@/shared/components/shadcn-ui/Button";
import { Input } from "@/shared/components/shadcn-ui/Input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/shadcn-ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import DoorIcon from "@/shared/assets/door-icon.svg";
import ControllerIcon from "@/shared/assets/controller-icon.svg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Globe, User2 } from "lucide-react";
import { useUserStore } from "@/shared/stores/userStore";
import playService from "@/shared/services/playService";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useState, useEffect } from "react";
import userService from "@/shared/services/userService";
import { MAX_LENGHT_OF_NICKNAME } from "@/shared/constants";

const formSchema = z.object({
  nickname: z.string().min(2).max(50).trim(),
  language: z.string({
    required_error: "Please select an language.",
  }),
});

const PlayForm = () => {
  const { user, setUser } = useUserStore();
  const { socket } = useSocketStore();
  const navigate = useNavigate();
  const [formAction, setFormAction] = useState<"quick-play" | "find-room">(
    "quick-play"
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: user?.nickname,
      language: user?.language,
    },
  });

  const handleSubmit = (_: z.infer<typeof formSchema>) => {
    if (formAction === "quick-play") return handleQuickPlay();
  };

  const handleQuickPlay = async () => {
    try {
      const nickname = form.getValues("nickname");
      const language = form.getValues("language");

      if (user?.nickname !== nickname || user?.language !== language) {
        const { data } = await userService.updateUser({
          ...user,
          nickname,
          language,
        });

        setUser(data);
      }
      const { data } = await playService.quickPlay();
      socket?.emit("join-room", data);

      navigate("/" + data, { state: { wait: false }, replace: true });
    } catch (error: any) {
      alert(error.response.data.response);
    }
  };

  useEffect(() => {
    if (!user) return;
    form.setValue("nickname", user.nickname);
    form.setValue("language", user.language);
  }, [user]);

  useEffect(() => {
    socket?.on("error", () => {
      navigate("/user/existing");
    });

    return () => {
      socket?.off("error");
    };
  }, [socket]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-2 md:space-y-5 2xl:space-y-8 w-[80%] flex flex-1 flex-col items-center justify-stretch"
      >
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => {
            const numberOfCharactersLeft =
              MAX_LENGHT_OF_NICKNAME - field.value.length;
            return (
              <FormItem className="flex items-start flex-1 max-lg:flex-col text-slate-400">
                <FormLabel className="flex items-center gap-3 mt-5">
                  <div>
                    <User2 size={28} strokeWidth={2} color={"#22A699"} />
                  </div>
                  <div className="mr-3 text-lg font-bold text-primaryTextColor">
                    NICKNAME
                  </div>
                </FormLabel>
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
                      <span className="absolute text-[10px] text-slate-400 top-1/2 -translate-y-1/2 right-2">
                        {numberOfCharactersLeft} chars left
                      </span>
                    </>
                  </FormControl>
                  <FormMessage className="text-xs absolute bottom-[-20px] 2xl:bottom-[-32px] left-0 w-[140%] 2xl:w-[120%] leading-4" />
                </div>
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-1 w-full max-lg:flex-col md:items-center text-slate-400">
              <FormLabel className="flex items-center gap-3 mt-2">
                <div>
                  <Globe color={"#22A699"} size={28} />
                </div>
                <div className="mr-3 text-lg font-bold text-primaryTextColor">
                  LANGUAGE
                </div>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full h-12 text-lg font-bold border-2 border-primaryTextColor rounded-xl">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className="text-lg font-bold border-2 border-primaryTextColor">
                    <SelectItem value="en">English (EN)</SelectItem>
                    <SelectItem value="vi">Vietnamese (VN)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="opacityHover"
            className="gap-4 md:mt-2 mt-5 rounded-full border-8 border-black font-black bg-[#22A699] p-5"
            onClick={() => setFormAction("find-room")}
          >
            <img src={DoorIcon} alt="" className="w-[20%]" />
            <p>ROOMS</p>
          </Button>

          <Button
            type="submit"
            variant="opacityHover"
            className="gap-4 md:mt-2 mt-5 rounded-full border-8 border-black font-black bg-[#FFE569] p-5"
            onClick={() => setFormAction("quick-play")}
          >
            <img src={ControllerIcon} alt="" className="w-[25%]" />
            <p>PLAY</p>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PlayForm;
