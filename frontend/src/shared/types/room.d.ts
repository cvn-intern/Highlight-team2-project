import { GameStatus } from "../stores/gameStore";

type RoomType = {
    code_room: string;
    created_at: Date;
    id: number;
    is_public: boolean;
    language: {
        name: string;
    };
    max_player: number;
    participants: number;
    thumbnail: string;
    time_per_round: number;
    number_of_round: number;
    updated_at: Date;
    words_collection: {
        id: number;
        theme: {
            name: string;
        }
    };
}

type RoomStatusType = {
    success: boolean;
    status?: GameStatus;
    progress?: number;
}