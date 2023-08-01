type RoomList = {
    id: number;
    thumbnail: string;
    theme_name: string;
    code_room: string;
    number_of_participants: number;
    max_player: number;
    language: string;
    current_round: number;
    number_of_round: number;
    is_public: boolean;
    created_at: Date;
    updated_at: Date;
}