type CreateWordsCollectionDTO = {
  theme_id: number;
  language_code: string;
  words_list: WordType[];
};

type ReturnCreateWordsCollection = {
  theme_id: number;
  creator_id: number;
  language_code: string;
  is_created_by_system: boolean;
  id: number;
  created_at: string;
  updated_at: string;
};
