export interface RoomInterface {
  id?: number;
  host?: number;
  max_player?: number;
  theme?: number;
  number_of_round?: number;
  time_per_round?: number;
  language?: string;
  is_public?: boolean;
  thumbnail?: string;
  code_room?: string;
  created_at?: string;
  updated_at?: string;
  users?: [];
}
