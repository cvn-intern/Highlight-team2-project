import { IsNotEmpty } from 'class-validator';

export type WordType = {
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

export class CreateWordsCollectionDto {
  @IsNotEmpty()
  language_code: string;

  @IsNotEmpty()
  theme_id: number;

  @IsNotEmpty()
  words_list: WordType[];
}
