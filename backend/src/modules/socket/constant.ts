//socket chat event receive from client
export const JOIN_ROOM_CHANNEL: string = 'join-room';
export const CHAT_ROOM_CHANNEL: string = 'chat-room';
export const LEAVE_ROOM_CHANNEL: string = 'leave-room';
export const ANSWER_ROOM_CHANNEL: string = 'answer-room';

//socket draw event receive from client
export const NEW_PLAYER_CHANNEL: string = 'new-player';
export const CANVAS_STATE_CHANNEL: string = 'canvas-state';
export const START_DRAWING_CHANNEL: string = 'start-drawing';
export const DRAWING_CHANNEL: string = 'drawing';
export const FINISH_DRAWING_CHANNEL: string = 'finish-drawing';
export const CLEAR_CANVAS_CHANNEL: string = 'clear-canvas';

//socket draw event emit to client
export const DRAWER_START_DRAWING: string = 'drawer-start-drawing';
export const DRAWER_DRAWING: string = 'drawer-drawing';
export const DRAWER_FINISH_DRAWING: string = 'drawer-finish-drawing';
export const DRAWER_CLEAR_CANVAS: string = 'drawer-clear-canvas';
export const GET_CANVAS_STATE: string = 'get-canvas-state';
export const CANVAS_STATE_FROM_SERVER: string = 'canvas-state-from-server';

// answer and chat constant
export const JOIN_ROOM_TYPE = 0;
export const LEAVE_ROOM_TYPE = 1;
export const CHAT_ROOM_TYPE = 2;
export const ANSWER_CORRETLY = 3;
export const ANSWER_APPROXIMATELY = 4;
export const ANSWER_WRONG = 5;
export const MINIMUM_CHAR_WRONG = 2;
export const ANSWER_CORRECTLY_CONTENT = 'hit!';
export const ANSWER_APPROXIMATELY_CONTENT = 'answer is close!';
export const JOIN_ROOM_CONTENT = 'joined';
export const LEAVE_ROOM_CONTENT = 'left';

// channel for host
export const QUALIFY_TO_START_CHANNEL = 'qualify-to-start';
export const PARTICIPANTS_CHANNEL = 'participants';

// channel for game
export const GAME_WAIT_PLAYERS_CHANNEL = 'wait-for-players';
export const GAME_START_CHANNEL = 'game-start';
export const GAME_NEW_TURN_CHANNEL = 'game-new-turn';
export const GAME_END_CHANNEL = 'game-end';
export const GAME_PROGRESS_CHANNEL = 'game-progress';
export const GAME_UPDATE_RANKING_CHANNEL = 'update-ranking';
export const GAME_INTERVAL_SHOW_WORD_CHANNEL = 'interval-show-word';

export const GAME_PLAY = 'game-play';
export const GAME_STATUS = 'game-status';
