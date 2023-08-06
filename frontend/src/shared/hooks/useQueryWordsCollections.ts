import { useQuery } from "@tanstack/react-query";
import wordCollectionService from "../services/wordCollectionService";

export const useQueryWordsCollections = (wordsCollectionId: number) => {
  return useQuery({
    queryKey: ["wordsCollection", wordsCollectionId],
    queryFn: () =>
      wordCollectionService.getWordsCollectionInfomationById(wordsCollectionId),
    enabled: !!wordsCollectionId,
  });
};
