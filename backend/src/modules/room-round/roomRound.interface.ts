export interface RoomRoundInterface {
  room_id: number;
  current_round: number;
  word: string;
  started_at: Date;
  ended_at?: Date;
  painter: number;
  next_painter: number;
}
