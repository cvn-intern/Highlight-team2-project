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

import { Eye, Globe, Trophy, User2 } from "lucide-react";

import _ from "lodash";
import { z } from "zod";
import { Dispatch, SetStateAction } from "react";

const MIN_PLAYER_IN_ROOM = 2;
const MAX_PLAYER_IN_ROOM = 50;
const NUMBER_OF_PLAYER = _.range(MIN_PLAYER_IN_ROOM, MAX_PLAYER_IN_ROOM + 1, 1);

const MIN_ROUND = 1;
const MAX_ROUND = 15;
const NUMBER_OF_ROUND = _.range(MIN_ROUND, MAX_ROUND + 1, 1);

type Props = {
  handleSubmit: (_: z.infer<any>) => Promise<void>;
  form: any;
  languageCode: string;
  setLanguageCode: Dispatch<SetStateAction<string>>;
};

const SettingRoomForm = ({
  handleSubmit,
  form,
  languageCode,
  setLanguageCode,
}: Props) => {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col items-center w-full px-5 space-y-5 md:space-y-5 2xl:space-y-8 justify-stretch"
      >
        <FormField
          control={form.control}
          name="players"
          render={({ field }) => (
            <FormItem className="flex justify-between w-full max-lg:flex-col md:items-center text-slate-400">
              <FormLabel className="flex items-center gap-3 mt-2">
                <div>
                  <User2 className="text-iconCreateRoomColor" size={28} />
                </div>
                <div className="mr-3 font-bold text-mg lg:text-xl text-primaryTextColor">
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
                      return (
                        <SelectItem key={value} value={`${value}`}>
                          {value}
                        </SelectItem>
                      );
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
                  <Trophy className="text-iconCreateRoomColor" size={28} />
                </div>
                <div className="mr-3 font-bold text-mg lg:text-xl text-primaryTextColor">
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
                      return (
                        <SelectItem
                          key={value}
                          datatype=""
                          value={String(value)}
                        >
                          {value}
                        </SelectItem>
                      );
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
                  <Eye className="text-iconCreateRoomColor" size={28} />
                </div>
                <div className="mr-3 font-bold text-mg lg:text-xl text-primaryTextColor">
                  VISIBLE
                </div>
              </FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col items-start w-full gap-2 text-slate-400">
              <FormLabel className="flex items-center gap-3 mt-4">
                <div>
                  <Globe className="text-iconCreateRoomColor" size={28} />
                </div>
                <div className="mr-3 font-bold text-mg lg:text-xl text-primaryTextColor">
                  LANGUAGE
                </div>
              </FormLabel>
              <FormControl>
                <Select
                  value={languageCode}
                  onValueChange={(value) => {
                    setLanguageCode(value);
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger className="w-full font-bold border-2 rounded-xl md:text-lg text-slate-500">
                    <SelectValue placeholder="Themes Filter" />
                  </SelectTrigger>
                  <SelectContent className="font-semibold rounded-xl md:text-lg text-slate-500">
                    <SelectItem value={"all"}>All</SelectItem>
                    <SelectItem value={"en"}>English</SelectItem>
                    <SelectItem value={"vi"}>Tiếng Việt</SelectItem>
                  </SelectContent>
                </Select>
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
