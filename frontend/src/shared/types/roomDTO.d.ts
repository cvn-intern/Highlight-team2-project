type RoomCreateDTO = {
  max_player: number;
  words_collection_id: number;
  number_of_round: number;
  time_per_round: number;
  is_public: boolean;
};

type GetRoomsByQueryDTO = {
  theme: string;
  languageCode: string;
  search: string;
};
