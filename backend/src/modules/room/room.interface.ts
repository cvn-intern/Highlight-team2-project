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
  created_at?: string;
  updated_at?: string;
  users?: [];
}
