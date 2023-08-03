import { Globe, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/shadcn-ui/select";
import { Input } from "@/shared/components/shadcn-ui/Input";
import { Theme } from "@/shared/types/theme";
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/shared/components/shadcn-ui/Button";
import { useUserStore } from "@/shared/stores/userStore";
import CustomRadioGroup from "@/shared/components/CustomRadioGroup";
import { DIFFICULTY_OPTIONS } from "./constants";

type Props = {
  themeId: number;
  setThemeId: Dispatch<SetStateAction<number>>;
  themes: Theme[];
  difficulty: string;
  setDifficulty: Dispatch<SetStateAction<string>>;
  word: string;
  setWord: Dispatch<SetStateAction<string>>;
};

export default function SettingThemeForm({
  themeId,
  setThemeId,
  themes,
  difficulty,
  setDifficulty,
  word,
  setWord,
}: Props) {
  const { user } = useUserStore();
  return (
    <div className="lg:w-[42%] w-full h-full border rounded-2xl bg-white">
      <div className="flex flex-col justify-between border p-5 m-5 rounded-xl h-[91.5%]">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-balsamiq text-[#1B67AD] mt-5">
            1. THEME NAME
          </p>
          <Select
            value={themeId.toString()}
            onValueChange={(value) => {
              setThemeId(parseInt(value));
            }}
          >
            <SelectTrigger className="rounded-[8px] md:text-lg font-bold border-2 text-slate-500 capitalize">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent className="font-semibold rounded-[8px] md:text-lg text-slate-500">
              {themes.map((theme) => {
                return (
                  <SelectItem
                    key={theme.id}
                    value={theme.id.toString()}
                    className="capitalize"
                  >
                    {theme.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        {/* End theme name */}
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-balsamiq text-[#1B67AD] mt-5">
            2. LANGUAGE
          </p>
          <div className="flex gap-4 text-xl font-balsamiq text-gray-400 mt-5">
            <Globe size={28} strokeWidth={2} color={"#1B67AD"} />
            {user?.language ? user?.language.toUpperCase() : "EN"}
          </div>
        </div>
        {/* End language */}
        <div className="flex flex-col gap-1">
          <p className="text-2xl font-balsamiq text-[#1B67AD] mt-5">
            3. CREATE WORDS
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-400 font-semibold">
              Add new word to the list
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                className="rounded-[8px]"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                }}
              />
              <Button className="rounded-[8px] bg-[#1B67AD] text-white flex gap-2">
                <Plus size={16} strokeWidth={2} />
                Add
              </Button>
            </div>
            <CustomRadioGroup
              options={DIFFICULTY_OPTIONS}
              state={difficulty}
              setState={setDifficulty}
            />
          </div>
        </div>
        {/* End create words */}
      </div>
    </div>
  );
}
