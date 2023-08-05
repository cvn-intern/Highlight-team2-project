import { useMutation } from "@tanstack/react-query";
import wordCollectionService from "@/shared/services/wordCollectionService";

export const useUpdateWordsCollection = () => {
  return useMutation({
    mutationFn: wordCollectionService.updateWordsCollection,
    onSuccess: () => {
      // Do something here bro
    },
    onError: ({ error }) => {
      alert(error);
    },
  });
};
