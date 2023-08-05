//socket chat event receive from client
export const JOIN_ROOM_CHANNEL = 'join-room';
export const CHAT_ROOM_CHANNEL = 'chat-room';
export const LEAVE_ROOM_CHANNEL = 'leave-room';
export const ANSWER_ROOM_CHANNEL = 'answer-room';

//socket draw event receive from client
export const NEW_PLAYER_CHANNEL = 'new-player';
export const CANVAS_STATE_CHANNEL = 'canvas-state';
export const START_DRAWING_CHANNEL = 'start-drawing';
export const DRAWING_CHANNEL = 'drawing';
export const FINISH_DRAWING_CHANNEL = 'finish-drawing';
export const CLEAR_CANVAS_CHANNEL = 'clear-canvas';

//socket draw event emit to client
export const DRAWER_START_DRAWING = 'drawer-start-drawing';
export const DRAWER_DRAWING = 'drawer-drawing';
export const DRAWER_FINISH_DRAWING = 'drawer-finish-drawing';
export const DRAWER_CLEAR_CANVAS = 'drawer-clear-canvas';
export const GET_CANVAS_STATE = 'get-canvas-state';
export const CANVAS_STATE_FROM_SERVER = 'canvas-state-from-server';

// answer and chat constant
export const JOIN_ROOM_TYPE = 0;
export const LEAVE_ROOM_TYPE = 1;
export const CHAT_ROOM_TYPE = 2;
export const ANSWER_CORRETLY = 3;
export const ANSWER_APPROXIMATELY = 4;
export const ANSWER_WRONG = 5;
export const BLOCK_MESSAGE = 6;
export const MINIMUM_CHAR_WRONG = 2;
export const ANSWER_CORRECTLY_CONTENT = 'hit!';
export const ANSWER_APPROXIMATELY_CONTENT = 'answer is close!';
export const JOIN_ROOM_CONTENT = 'joined';
export const LEAVE_ROOM_CONTENT = 'left';
export const SERVER_BLOCKED_MESSAGE_CONTENT = 'Server blocked this message!';
export const HOST_KICK_USER_CONTENT = 'has been kicked by host!';

// channel for host
export const QUALIFY_TO_START_CHANNEL = 'qualify-to-start';
export const PARTICIPANTS_CHANNEL = 'participants';
export const KICK_CHANNEL = 'kick';

// channel for game
export const GAME_WAIT_PLAYERS_CHANNEL = 'wait-for-players';
export const GAME_START_CHANNEL = 'game-start';
export const GAME_NEW_TURN_CHANNEL = 'game-new-turn';
export const GAME_END_CHANNEL = 'game-end';
export const GAME_REFRESH_CHANNEL = 'refresh-round';
export const GAME_REFRESH_DRAWER_CHANNEL = 'refresh-drawer';
export const GAME_PRESENT_PROGRESS_CHANNEL = 'game-present-progress';
export const GAME_PRESENT_PROGRESS_NEW_PLAYER_CHANNEL = 'game-present-progress-new-player';

export const NOTIFY_CHANNEL = 'notification';
export const GAME_PROGRESS_CHANNEL = 'game-progress';
export const GAME_UPDATE_RANKING_CHANNEL = 'update-ranking';
export const GAME_INTERVAL_SHOW_WORD_CHANNEL = 'interval-show-word';
export const GAME_DRAWER_IS_OUT = 'drawer-is-out';
export const GAME_HINT_WORD = 'hint-word';
export const SEND_HINT_WORD = 'send-hint-word';


export const GAME_PLAY = 'game-play';
export const GAME_STATUS = 'game-status';
export const GAME_NEW_TURN = 'new-turn';
export const END_GAME = 'end-game';
export const RESET_GAME = 'reset-game';

export const MIN_PROGRESS_PERCENTAGE = 0;
export const MAX_PROGRESS_PERCENTAGE = 100;
export const TIME_PERSTEP = 100;
export const INTERVAL_DURATION_MILISECONDS = 10000;
