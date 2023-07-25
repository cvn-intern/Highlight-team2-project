type RoomInfo = {
    id: number
    code_room: string
    is_public: boolean
    max_player_round: number
    thumbnail: string
    time_per_round: number
    language: {
        name: string
    }
    words_collection: {
        id: number
        theme: {
            name: string
        }
    }
    participants: number
}