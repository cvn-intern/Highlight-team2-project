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
import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, Trophy, User2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import _ from "lodash";

const formSchema = z.object({
  players: z.string().nonempty(),
  visible: z.boolean(),
  round: z.string().nonempty(),
});
const numberOfPlayer = _.range(1, 15, 1);

const SettingRoomForm = () => {

  const navigate = useNavigate();
  const [formAction, setFormAction] = useState<"quick-play" | "find-room">(
    "quick-play"
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      players: "8",
      round: "3",
      visible: true
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSubmit = (_: z.infer<typeof formSchema>) => {
    if (formAction === "quick-play") return handleCreateRoom();
  };

  const handleCreateRoom = async () => {
    try {
      const players = parseInt(form.getValues("players"));
      const round = parseInt(form.getValues("round"));
      const visible = form.getValues("visible");

      console.log(players);
      console.log(round);
      console.log(visible);

    } catch (error: any) {
      (error);
      useToaster({
        type: "error",
        message: error.response.data.response || "Some error occurred!",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-5 md:space-y-5 2xl:space-y-8 w-full flex flex-col items-center justify-stretch px-5"
      >

        <FormField
          control={form.control}
          name="players"
          render={({ field }) => (
            <FormItem className="flex justify-between w-full max-lg:flex-col md:items-center text-slate-400">
              <FormLabel className="flex items-center gap-3 mt-2">
                <div>
                  <User2 color={"#4240C1"} size={28} />
                </div>
                <div className="mr-3 text-lg font-bold text-primaryTextColor">
                  PLAYERS
                </div>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}                
                >
                  <SelectTrigger className="lg:w-[30%] w-full h-12 text-lg font-bold border-2 border-primaryTextColor rounded-xl">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto h-[150px] text-lg font-bold border-2 border-primaryTextColor">
                    {numberOfPlayer.map((value) => {
                      return (<SelectItem value={`${value}`}>{value}</SelectItem>)
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
          name="round"
          render={({ field }) => (
            <FormItem className="flex justify-between w-full max-lg:flex-col md:items-center text-slate-400">
              <FormLabel className="flex items-center gap-3 mt-2">
                <div>
                  <Trophy color={"#4240C1"} size={28} />
                </div>
                <div className="mr-3 text-lg font-bold text-primaryTextColor">
                  ROUND
                </div>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger className="lg:w-[30%] w-full h-12 text-lg font-bold border-2 border-primaryTextColor rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto h-[150px] text-lg font-bold border-2 border-primaryTextColor">
                    {_.range(1, 11, 1).map((value) => {
                      return (<SelectItem datatype="" value={String(value)}>{value}</SelectItem>)
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
          name="visible"
          render={() => (
            <FormItem className="flex justify-between w-full md:items-center text-slate-400">
              <FormLabel className="flex items-center gap-3 mt-2">
                <div>
                  <Eye color={"#4240C1"} size={28} />
                </div>
                <div className="mr-3 text-lg font-bold text-primaryTextColor">
                  VISIBLE
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
