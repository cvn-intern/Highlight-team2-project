type RoomCreate = {
    id: number;
    code_room: string;
    host_id: number;
    max_player: number;
    time_per_round: number;
    number_of_round: number;
    thumbnail: string;
    is_public: boolean;
    words_collection_id: number;
    language_code: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}