import Logo from "@/shared/components/Logo";
import SloganImg from "@/shared/assets/slogan.png";
import MainLayout from "@/shared/components/MainLayout";
import ThemeHeader from "./ThemeHeader.component";
import ThemeContent from "./ThemeContent.component";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Theme404 from "./Theme404.component";
import ThemeLoading from "./ThemeLoading.component";
import { useGetWordsCollectionInfomationById } from "@/shared/hooks/useGetWordsCollectionInfomationById";

export default function Page() {
  const { state } = useLocation();
  const isCreate = !state || state.type === "create";
  const wordsCollectionId = state?.wordsCollectionId;
  const [wordsList, setWordsList] = useState<WordType[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const { data, isLoading, isFetching, isError } =
    useGetWordsCollectionInfomationById(wordsCollectionId);
  const wordsCollectionInformation = data?.data;

  useEffect(() => {
    if (wordsCollectionInformation) {
      setWordsList(wordsCollectionInformation.words_list);
    }
  }, [wordsCollectionInformation]);

  if ((isLoading || isFetching) && !!wordsCollectionId) return <ThemeLoading />;

  const wordsCollectionIsNotFound =
    (isError || (!isLoading && !isFetching && !wordsCollectionInformation)) &&
    !isCreate;
  if (wordsCollectionIsNotFound) return <Theme404 />;

  return (
    <MainLayout>
      <div className="flex-col grid lg:w-[90%]">
        <Logo customClassname="justify-self-center max-lg:mt-12 mt-8 max-lg:hidden" />
        <img
          src={SloganImg}
          alt="Slogan"
          className="justify-self-center slogan-width slogan-responsive w-[250px] 2xl:w-[300px] mt-2.5 2xl:mt-5"
        />
        <div className="justify-self-center w-[90%] lg:h-[90%] min-h-[70vh] bg-white flex flex-col items-center mb-5 mt-5 rounded-2xl p-8">
          <ThemeHeader
            wordsList={wordsList}
            isCreate={isCreate}
            isDirty={isDirty}
          />
          <ThemeContent
            wordsList={wordsList}
            setWordsList={setWordsList}
            isCreate={isCreate}
            wordsCollectionInformation={wordsCollectionInformation}
            isDirty={isDirty}
            setIsDirty={setIsDirty}
          />
        </div>
      </div>
    </MainLayout>
  );
}
