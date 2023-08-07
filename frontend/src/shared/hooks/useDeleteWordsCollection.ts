/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import wordCollectionService from "../services/wordCollectionService";

export const useDeleteWordsCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wordCollectionService.deleteWordsCollection,
    onSuccess: () => {
      queryClient.invalidateQueries(["wordsCollection", 0, "all"]);
    },
    onError: ({ error }) => {
      alert(error);
    },
  });
};
