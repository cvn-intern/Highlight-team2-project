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

import { Eye, Trophy, User2 } from "lucide-react";

import _ from "lodash";
import { z } from "zod";

const MIN_PLAYER_IN_ROOM = 2;
const MAX_PLAYER_IN_ROOM = 50;
const NUMBER_OF_PLAYER = _.range(MIN_PLAYER_IN_ROOM, MAX_PLAYER_IN_ROOM + 1, 1);


const MIN_ROUND = 1;
const MAX_ROUND = 15;
const NUMBER_OF_ROUND = _.range(MIN_ROUND, MAX_ROUND + 1, 1);

type Props = {
  handleSubmit: (_: z.infer<any>) => Promise<void>,
  form: any
}


const SettingRoomForm = ({ handleSubmit, form }: Props) => {

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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="overflow-y-auto h-[150px] text-lg font-bold border-2 border-primaryTextColor">
                    {NUMBER_OF_PLAYER.map((value) => {
                      return (<SelectItem key={value} value={`${value}`}>{value}</SelectItem>)
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
                    {NUMBER_OF_ROUND.map((value) => {
                      return (<SelectItem key={value} datatype="" value={String(value)}>{value}</SelectItem>)
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
          render={({ field }) => (
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
                <Switch checked={field.value}
                  onCheckedChange={field.onChange} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" id="submitBtn" hidden></button>
      </form>
    </Form>
  );
};

export default SettingRoomForm;
