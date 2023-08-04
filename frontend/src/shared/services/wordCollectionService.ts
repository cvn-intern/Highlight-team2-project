import axiosClient from "../lib/axiosClient";
import { WordsCollection } from "../types/wordsCollection";
export default {
  getWordCollections: (type: number, language_code: string) =>
    axiosClient.get<WordsCollection[]>(
      `words-collection?type=${type}&language_code=${language_code}`
    ),
};
