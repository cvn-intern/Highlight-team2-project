export type WordType = {
  id: number;
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
};
export type WordsCollectionType = {
  id: number;
  theme_id: number;
  creator_id: number;
  language_code: string;
  is_created_by_system: boolean;
  created_at: string;
  updated_at: string;
  words_list: WordType[];
};
