/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from "react";
import DoorIcon from "@/shared/assets/door-icon.svg";
import { Button } from "@/shared/components/shadcn-ui/Button";
import themeService from "@/shared/services/themeService";
import { Theme } from "@/shared/types/theme";
import { LogOut } from "lucide-react";
import SettingThemeForm from "./SettingThemeForm.component";
import { Search } from "lucide-react";
import WordsContainer from "./WordsContainer";
import { useTranslation } from "react-i18next";

const CreateThemeContent = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [themeId, setThemeId] = useState(1);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [word, setWord] = useState("");
  const [wordsList, setWordsList] = useState<WordType[]>([]);
  const { t } = useTranslation();

  const totalWords = useMemo(() => wordsList.length, [wordsList]);
  const totalEasyWords = useMemo(
    () =>
      wordsList.reduce((total, currentWord) => {
        return currentWord.difficulty === "easy" ? total + 1 : total;
      }, 0),
    [wordsList]
  );
  const totalMediumWords = useMemo(
    () =>
      wordsList.reduce((total, currentWord) => {
        return currentWord.difficulty === "medium" ? total + 1 : total;
      }, 0),
    [wordsList]
  );
  const totalHardWords = useMemo(
    () => totalWords - totalEasyWords - totalMediumWords,
    [totalWords, totalEasyWords, totalMediumWords]
  );

  const thereIsWordIsExistedInWordsList = useMemo(
    () => wordsList.some((wordObj) => wordObj.word === word),
    [word, wordsList]
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await themeService.getThemes();
      setThemes(data);
    })();
  }, []);

  const handleDeleteWord = (index: number) => {
    const newWordsList = [...wordsList];
    newWordsList.splice(index, 1);
    setWordsList(newWordsList);
  };

  const handleAddWord = (
    word: string,
    difficulty: "easy" | "medium" | "hard"
  ) => {
    const newWordsList = [...wordsList];
    newWordsList.push({ word, difficulty });
    setWordsList(newWordsList);
  };

  return (
    <>
      <div className="flex max-lg:flex-col justify-center items-center lg:w-[90%] lg:h-[80%] lg:bg-gray-300 rounded-2xl mt-5 lg:p-6 gap-x-2">
        <SettingThemeForm
          themeId={themeId}
          setThemeId={setThemeId}
          themes={themes}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          word={word}
          thereIsWordIsExistedInWordsList={thereIsWordIsExistedInWordsList}
          setWord={setWord}
          handleAddWord={handleAddWord}
        />
        <div className="flex flex-col items-center w-full p-4 bg-white lg:h-full gap-y-4 rounded-2xl">
          <div className="flex justify-between w-full mt-1 gap-x-5 ">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-400 uppercase">
                  {totalWords} {t("CreateTheme.numberOfWord")}
                </p>
                {/* Easy */}
                <div className="flex items-center gap-[2px]">
                  <div className="h-[12px] w-[8px] rounded-[5px] bg-green-600"></div>
                  <span className="font-medium text-gray-400">
                    {totalEasyWords}
                  </span>
                </div>
                {/* Medium */}
                <div className="flex items-center gap-[2px]">
                  <div className="h-[12px] w-[8px] rounded-[5px] bg-yellow-600"></div>
                  <span className="font-medium text-gray-400">
                    {totalMediumWords}
                  </span>
                </div>
                {/* Hard */}
                <div className="flex items-center gap-[2px]">
                  <div className="h-[12px] w-[8px] rounded-[5px] bg-red-600"></div>
                  <span className="font-medium text-gray-400">
                    {totalHardWords}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-[4px] border border-gray-200 overflow-hidden p-2 focus-within:border-gray-400">
              <Search size={16} />
              <input
                type="text"
                className="leading-5 border-none outline-none placeholder:text-gray-400 placeholder:font-medium"
                placeholder={t("CreateTheme.searchLabel")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 w-full p-4 bg-gray-300 rounded-2xl">
            <WordsContainer
              wordsList={wordsList}
              handleDeleteWord={handleDeleteWord}
            />
          </div>
        </div>
      </div>
      <div className="flex max-lg:flex-col lg:gap-3 lg:my-5 max-md:mt-[-15vh]">
        <Button
          type="submit"
          variant="opacityHover"
          className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-[#C13A3A] py-5 w-[200px]"
          //   onClick={handleExitButton}
        >
          <LogOut strokeWidth={3} size={32} />
          <p className="text-lg">{t("ExitButton")}</p>
        </Button>
        <Button
          type="submit"
          variant="opacityHover"
          //   onClick={handleSubmitClick}
          className="gap-4 md:mt-2 mt-3 rounded-full border-8 border-black font-black bg-[#22A699] py-5 w-[200px]"
        >
          <img src={DoorIcon} alt="" className="w-[18%]" />
          <p>{t("CreateTheme.createThemeButton")}</p>
        </Button>
      </div>
    </>
  );
};

export default CreateThemeContent;
