import axiosClient from "../lib/axiosClient";
import { WordsCollection } from "../types/wordsCollection";

export default {
  getWordCollections: (type: number, language_code: string) =>
    axiosClient.get<WordsCollection[]>(
      `words-collection?type=${type}&language_code=${language_code}`
    ),
  createWordsCollection: ({
    theme_id,
    language_code,
    words_list,
  }: CreateWordsCollectionDTO) =>
    axiosClient.post<ReturnCreateWordsCollection>(`words-collection`, {
      theme_id,
      language_code,
      words_list,
    }),
  getWordsCollectionInfomationById: (id: number) =>
    axiosClient.get<WordsCollectionInformation>(`words-collection/${id}`),
  updateWordsCollection: ({
    id,
    theme_id,
    language_code,
    words_list,
  }: UpdateWordsCollectionDTO) =>
    axiosClient.put<ReturnCreateWordsCollection>(`words-collection/${id}`, {
      theme_id,
      language_code,
      words_list,
    }),
  deleteWordsCollection: (id: number) =>
    axiosClient.delete<ReturnCreateWordsCollection>(`words-collection/${id}`),
};
