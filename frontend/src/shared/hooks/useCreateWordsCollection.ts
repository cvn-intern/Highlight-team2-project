import { useMutation } from "@tanstack/react-query";
import wordCollectionService from "@/shared/services/wordCollectionService";

export const useCreateWordsCollection = () => {
  return useMutation({
    mutationFn: wordCollectionService.createWordsCollection,
    onSuccess: ({  }) => {
      // Do something here bro
    },
    onError: ({ error }) => {
      alert(error);
    },
  });
};
