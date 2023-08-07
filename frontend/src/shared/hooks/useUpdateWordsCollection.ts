import { useMutation, useQueryClient } from "@tanstack/react-query";
import wordCollectionService from "@/shared/services/wordCollectionService";

export const useUpdateWordsCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wordCollectionService.updateWordsCollection,
    onSuccess: () => {
      queryClient.invalidateQueries(["wordsCollection", 0, "all"]);
    },
    onError: ({ error }) => {
      alert(error);
    },
  });
};
