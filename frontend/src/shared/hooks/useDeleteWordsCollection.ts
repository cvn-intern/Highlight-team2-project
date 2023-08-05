/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import wordCollectionService from "../services/wordCollectionService";

export const useDeleteWordsCollection = () => {
  return useMutation({
    mutationFn: wordCollectionService.deleteWordsCollection,
    onSuccess: ({ data }) => {
      // Do something here bro
    },
    onError: ({ error }) => {
      alert(error);
    },
  });
};
