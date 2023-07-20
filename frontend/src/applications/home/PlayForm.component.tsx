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

const formSchema = z.object({
  nickname: z.string().min(2).max(50),
  language: z.string({
    required_error: "Please select an language.",
  }),
});

const PlayForm = () => {
  const { user, setUser } = useUserStore();
  const { socket } = useSocketStore();
  const navigate = useNavigate();

  const [formAction, setFormAction] = useState<"quick-play" | "find-room">("quick-play")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: user?.nickname,
      language: user?.language,
    },
  });

  const handleSubmit = (_: z.infer<typeof formSchema>) => {
    if (formAction === 'quick-play') return handleQuickPlay()
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

      navigate("/" + data);

      socket?.emit("join-room", data);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (!user) return
    form.setValue("nickname", user.nickname)
    form.setValue("language", user.language)
  }, [user])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-2 md:space-y-5 2xl:space-y-8 md:w-[50%] w-[80%]"
      >
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem className="flex max-md:flex-col items-start text-slate-400">
              <FormLabel className="flex items-center gap-3 mt-5">
                <div>
                  <User2 size={28} strokeWidth={2} color={"#22A699"} />
                </div>
                <div className="mr-3 text-lg font-bold text-primaryTextColor">
                  NICKNAME
                </div>
              </FormLabel>
              <div className="relative flex flex-col">
                <FormControl>
                  <Input
                    {...field}
                    className={
                      "font-bold text-lg border-primaryTextColor border-2 h-12 rounded-xl"
                    }
                  />
                </FormControl>
                <FormMessage className="text-xs absolute bottom-[-20px] 2xl:bottom-[-32px] left-0 w-[140%] 2xl:w-[120%] leading-4" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex max-md:flex-col md:items-center text-slate-400">
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
                  <SelectTrigger className="w-[205px] border-primaryTextColor border-2 h-12 font-bold text-lg rounded-xl">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className="border-primaryTextColor border-2 font-bold text-lg">
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
            className="gap-4 mt-2 rounded-full border-8 border-black font-black bg-[#22A699] p-5"
            onClick={() => setFormAction("find-room")}
          >
            <img src={DoorIcon} alt="" className="w-[20%]" />
            <p>ROOMS</p>
          </Button>

          <Button
            type="submit"
            variant="opacityHover"
            className="gap-4 mt-2 rounded-full border-8 border-black font-black bg-[#FFE569] p-5"
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
