type GetWordCollectionsDTO = {
  type: number;
  language_code: string;
};

type CreateWordsCollectionDTO = {
  theme_id: number;
  language_code: string;
  words_list: WordType[];
};

type UpdateWordsCollectionDTO = {
  id: number;
  theme_id: number;
  language_code: string;
  words_list: WordType[];
};

type ReturnCreateWordsCollection = {
  id: number;
  theme_id: number;
  language_code: string;
  creator_id: number;
  is_created_by_system: boolean;
  created_at: string;
  updated_at: string;
};

type WordsCollectionInformation = {
  id: number;
  theme_id: number;
  creator_id: number;
  language_code: string;
  is_created_by_system: boolean;
  created_at: Date;
  updated_at: Date;
  theme: {
    id: number;
    name: string;
    thumbnail: string;
    language_code: string;
  };
  words_list: WordType[];
};
