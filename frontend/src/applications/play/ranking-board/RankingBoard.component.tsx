import {
  PARTICIPANTS_CHANNEL,
  START_GAME,
  WAIT_FOR_OTHER_PLAYERS,
} from '@/shared/components/IntervalCanvas';
import Logo from '@/shared/components/Logo';
import { useGameStore } from '@/shared/stores/gameStore';
import { useSocketStore } from '@/shared/stores/socketStore';
import { useUserStore } from '@/shared/stores/userStore';
import { useEffect, memo } from 'react';
import UserFrame from './UserFrame.component';
import { GAME_UPDATE_RANKING } from '../chat-answer/chatAnswer.helper';
import _ from 'lodash';
import { useParams } from 'react-router-dom';

export interface RankingUser {
  participants: Array<Participant>;
  max_player: number; 
}

const RankingBoard = () => {
  const { user } = useUserStore();
  const { socket } = useSocketStore();
  const {
    participants,
    maxPlayer,
    setParticipants,
    setGameStatus,
    setMaxPlayer,
    setIsHost,
    gameStatus,
    setIsDrawer,
    setCorrectAnswers,
    setRoomRound,
    isHost
  } = useGameStore();
  const { codeRoom } = useParams();

  useEffect(() => {
    socket?.on(PARTICIPANTS_CHANNEL, (data: RankingUser) => {
      setParticipants(data.participants);
      setMaxPlayer(data.max_player);
      const hostUser = _.find(
        data.participants,
        (participant) => participant.is_host
      );

      const isHost = hostUser?.id === user?.id
      setIsHost(isHost);
      if (data.participants.length === 1) {
        setGameStatus(WAIT_FOR_OTHER_PLAYERS);
        setIsDrawer(false);
        setParticipants(
          [...data.participants].map((participant) => ({ ...participant, score: 0 }))
        );
        setRoomRound(null)
        socket.emit(WAIT_FOR_OTHER_PLAYERS, codeRoom);
        return
      }

      if (
        data.participants.length >= 2 &&
        isHost &&
        gameStatus &&
        gameStatus === WAIT_FOR_OTHER_PLAYERS
      ) {
        setGameStatus(START_GAME);
        return
      }
      const drawer = _.find(
        data.participants,
        (participant) => participant.is_painter
      );

      const isDrawer = drawer?.id === user?.id;
      setIsDrawer(isDrawer);
    });

    return () => {
      socket?.off(PARTICIPANTS_CHANNEL);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, gameStatus, codeRoom, isHost, participants, user]);
  useEffect(() => {
    socket?.on(
      GAME_UPDATE_RANKING,
      (data: { correctAnswers: number[]; newParticipants: Participant[] }) => {
        setCorrectAnswers(data.correctAnswers);
        setParticipants(data.newParticipants);
      }
    );

    return () => {
      socket?.off(GAME_UPDATE_RANKING);
    };
  }, [socket, socket, participants]);

  const numberOfPlayers = participants.length;

  return (
    <div className="bg-white rounded-[10px] w-[var(--ranking-board-width)] h-full relative">
      <div className="absolute top-[-70px] md:top-[-55px] left-12 md:left-20 2xl:left-14">
        <Logo customClassname="md:w-[180px] 2xl:w-[205px] w-[250px]" />
      </div>
      <UserFrame
        rankingBoard={participants}
        maxPlayer={maxPlayer}
      />
      <div className="absolute w-[38px] h-[38px] shadow-sm text-[12px] font-bold text-gray-300 border-2 border-gray-300 rounded-full top-1 right-1 flexCenter bg-white">
        <span>{numberOfPlayers}</span>/<span>{maxPlayer}</span>
      </div>
    </div>
  );
};

export default memo(RankingBoard);
