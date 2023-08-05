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
import CustomRadioGroup from "@/shared/components/CustomRadioGroup";
import { DIFFICULTY_OPTIONS } from "./constants";
import { useTranslation } from "react-i18next";

type Props = {
  themeId: number;
  setThemeId: Dispatch<SetStateAction<number>>;
  themes: Theme[];
  difficulty: "easy" | "medium" | "hard";
  setDifficulty: Dispatch<SetStateAction<"easy" | "medium" | "hard">>;
  word: string;
  languageCode: string;
  thereIsWordIsExistedInWordsList: boolean;
  setWord: Dispatch<SetStateAction<string>>;
  handleAddWord: (word: string, difficulty: "easy" | "medium" | "hard") => void;
  isDirty: boolean;
  setIsDirty: Dispatch<SetStateAction<boolean>>;
};

export default function SettingThemeForm({
  themeId,
  setThemeId,
  themes,
  difficulty,
  setDifficulty,
  word,
  languageCode,
  thereIsWordIsExistedInWordsList,
  setWord,
  handleAddWord,
  isDirty,
  setIsDirty,
}: Props) {
  const { t } = useTranslation();
  const handleAddWordToWordsList = () => {
    if (
      !word ||
      !difficulty ||
      word.length === 0 ||
      thereIsWordIsExistedInWordsList
    )
      return;
    handleAddWord(word, difficulty);
    !isDirty && setIsDirty(true);
    setWord("");
  };
  return (
    <div className="xl:w-[42%] w-full h-full border rounded-2xl bg-white">
      <div className="flex flex-col justify-between border p-5 m-5 rounded-xl h-[91.5%]">
        <div className="flex flex-col gap-2">
          <p className="mt-5 text-lg lg:text-xl font-balsamiq text-headerBlueColor">
            1. {t("CreateTheme.themeName")}
          </p>
          <Select
            value={themeId.toString()}
            onValueChange={(value) => {
              !isDirty && setIsDirty(true);
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
          <p className="mt-5 text-lg lg:text-xl font-balsamiq text-headerBlueColor">
            2. {t("Language.languageLabel")}
          </p>
          <div className="flex gap-4 mt-5 text-xl text-gray-400 font-balsamiq">
            <Globe size={28} strokeWidth={2} color={"#1B67AD"} />
            {languageCode ? languageCode.toUpperCase() : "EN"}
          </div>
        </div>
        {/* End language */}
        <div className="flex flex-col gap-1">
          <p className="mt-5 text-lg lg:text-xl font-balsamiq text-headerBlueColor">
            3. {t("CreateTheme.createWordLabel")}
          </p>
          <div className="flex flex-col gap-2">
            {!thereIsWordIsExistedInWordsList && (
              <p className="text-sm font-semibold text-gray-400">
                {t("CreateTheme.createWordDescription")}
              </p>
            )}
            {thereIsWordIsExistedInWordsList && (
              <p className="text-sm font-semibold text-red-400">
                {t("CreateTheme.repeatedWordNotification")}
              </p>
            )}

            <div className="flex gap-2">
              <Input
                type="text"
                className="rounded-[8px]"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddWordToWordsList();
                  }
                }}
              />
              <Button
                className="rounded-[8px] bg-[#1B67AD] text-white flex gap-2"
                onClick={() => {
                  handleAddWordToWordsList();
                }}
                disabled={word.length === 0 || thereIsWordIsExistedInWordsList}
              >
                <Plus size={16} strokeWidth={2} />
                {t("CreateTheme.addButton")}
              </Button>
            </div>
            <CustomRadioGroup
              options={DIFFICULTY_OPTIONS}
              state={difficulty}
              setState={setDifficulty as Dispatch<SetStateAction<string>>}
            />
          </div>
        </div>
        {/* End create words */}
      </div>
    </div>
  );
}
