import { useQuery } from "@tanstack/react-query";
import wordCollectionService from "../services/wordCollectionService";

export const useQueryWordsCollections = (data: GetWordCollectionsDTO) => {
  const { type, language_code } = data;
  return useQuery({
    queryKey: ["wordsCollection", type, language_code],
    queryFn: () => wordCollectionService.getWordCollections(data),
  });
};
