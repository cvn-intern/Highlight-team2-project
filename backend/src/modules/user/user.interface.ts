export interface UserInterface {
  id?: number;
  avatar?: string;
  is_guest?: boolean;
  provider?: string;
  id_provider?: string;
  nickname?: string;
  language?: string;
  created_at?: Date;
  updated_at?: Date;
}
