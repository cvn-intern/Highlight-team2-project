type GameProgressUpdate = {
  codeRoom: string;
  progress: number;
};

type GameRankingUpdate = {
  codeRoom: string;
  correctAnswers: number[];
  newParticipants: Participant[];
};
