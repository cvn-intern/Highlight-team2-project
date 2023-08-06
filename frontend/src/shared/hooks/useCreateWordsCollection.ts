import { useMutation, useQueryClient } from "@tanstack/react-query";
import wordCollectionService from "@/shared/services/wordCollectionService";

export const useCreateWordsCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wordCollectionService.createWordsCollection,
    onSuccess: () => {
      queryClient.invalidateQueries(["wordsCollection", 0, "all"]);
    },
    onError: ({ error }) => {
      alert(error);
    },
  });
};
