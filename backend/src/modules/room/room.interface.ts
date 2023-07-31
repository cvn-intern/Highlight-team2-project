import { Word } from '../word/word.entity';

export interface RoomInterface {
  id?: number;
  host_id?: number;
  max_player?: number;
  words_collection_id?: number;
  number_of_round?: number;
  time_per_round?: number;
  language_code?: string;
  is_public?: boolean;
  thumbnail?: string;
  code_room?: string;
  created_at?: Date;
  updated_at?: Date;
  users?: [];
  langage?: {
    name: string;
  };
  words_collection?: {
    id: number;
    theme: {
      name: string;
    };
  };
  participants?: number;
}

export interface RoomRoundInfoInterface {
  word: string;
  painterRound: PainterRound;
  startedAt: Date;
  endedAt: Date;
}

export interface RoomStatusResponseInterface {
  success: boolean;
  status?: string;
}
