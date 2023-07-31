type GameProgressUpdate = {
  codeRoom: string;
  maximumTimeInMiliSeconds: number;
};

type GameRankingUpdate = {
  codeRoom: string;
  correctAnswers: number[];
  newParticipants: Participant[];
};
