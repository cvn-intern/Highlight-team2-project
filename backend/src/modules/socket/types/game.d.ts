type GameProgressUpdate = {
  codeRoom: string;
  maximumTimeInMiliSeconds: number;
};

type GamePresentProgress = {
  codeRoom: string;
  maximumTimeInMiliSeconds: number;
  startProgress: number
  status: string
  sendAt: Date
}

type GameRankingUpdate = {
  codeRoom: string;
  correctAnswers: number[];
  newParticipants: Participant[];
};
