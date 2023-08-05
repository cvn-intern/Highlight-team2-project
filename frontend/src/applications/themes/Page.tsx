import Logo from "@/shared/components/Logo";
import SloganImg from "@/shared/assets/slogan.png";
import MainLayout from "@/shared/components/MainLayout";
import ThemeHeader from "./ThemeHeader.component";
import ThemeContent from "./ThemeContent.component";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import wordCollectionService from "@/shared/services/wordCollectionService";
import Theme404 from "./Theme404.component";
import ThemeLoading from "./ThemeLoading.component";

export default function Page() {
  const { state } = useLocation();
  const isCreate = !state || state.type === "create";
  const wordsCollectionId = state?.wordsCollectionId;

  const { data, isLoading, isFetching, isError } = useQuery({
    queryKey: ["wordsCollection", wordsCollectionId],
    queryFn: () =>
      wordCollectionService.getWordsCollectionInfomationById(wordsCollectionId),
    enabled: !!wordsCollectionId,
  });
  const wordsCollectionInformation = data?.data;
  const [wordsList, setWordsList] = useState<WordType[]>(
    wordsCollectionInformation ? wordsCollectionInformation.words_list : []
  );

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
          <ThemeHeader wordsList={wordsList} />
          <ThemeContent
            wordsList={wordsList}
            setWordsList={setWordsList}
            isCreate={isCreate}
            wordsCollectionInformation={wordsCollectionInformation}
          />
        </div>
      </div>
    </MainLayout>
  );
}
