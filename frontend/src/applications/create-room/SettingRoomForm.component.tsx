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
import { Switch } from "@/shared/components/shadcn-ui/switch";

import useToaster from "@/shared/hooks/useToaster";
import playService from "@/shared/services/playService";
import userService from "@/shared/services/userService";
import { useSocketStore } from "@/shared/stores/socketStore";
import { useUserStore } from "@/shared/stores/userStore";
import { MULTIPLE_TAB } from "@/shared/types/errorCode";
import { zodResolver } from "@hookform/resolvers/zod";

import { Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import _ from "lodash";

const formSchema = z.object({
  nickname: z.string().trim().min(2).max(50),
  language: z.string({
    required_error: "Please select an language.",
  }),
});
const numberOfPlayer = _.range(1,15,1);
const SettingRoomForm = () => {

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      (error);
      useToaster({
        type: "error",
        message: error.response.data.response || "Some error occurred!",
      });
    }
  };

  useEffect(() => {
    if (!user) return;
    form.setValue("nickname", user.nickname);
    form.setValue("language", user.language);
  }, [user]);

  useEffect(() => {
    socket?.on("error", (error: ErrorSocket) => {
      if (error.code === MULTIPLE_TAB) {
        navigate("/user/existing");
      }
    });

    return () => {
      socket?.off("error");
    };
  }, [socket]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-2 md:space-y-5 2xl:space-y-8 w-full flex flex-col items-center justify-stretch px-5"
      >

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex justify-between w-full max-lg:flex-col md:items-center text-slate-400">
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
                  <SelectTrigger className="w-[30%] h-12 text-lg font-bold border-2 border-primaryTextColor rounded-xl">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent className="text-lg font-bold border-2 border-primaryTextColor">
                    {numberOfPlayer.map((value) => {
                      return (<SelectItem value={String(value)}>{value}</SelectItem>)
                    })}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex justify-between w-full max-lg:flex-col md:items-center text-slate-400">
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
                  <SelectTrigger className="w-[30%] h-12 text-lg font-bold border-2 border-primaryTextColor rounded-xl">
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
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex justify-between w-full max-lg:flex-col md:items-center text-slate-400">
              <FormLabel className="flex items-center gap-3 mt-2">
                <div>
                  <Globe color={"#22A699"} size={28} />
                </div>
                <div className="mr-3 text-lg font-bold text-primaryTextColor">
                  LANGUAGE
                </div>
              </FormLabel>
              <FormControl>
                <Switch />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SettingRoomForm;
