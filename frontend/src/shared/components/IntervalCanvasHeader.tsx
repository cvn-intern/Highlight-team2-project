import { useGameStore } from "../stores/gameStore";
import { INTERVAL_INACTIVE, INTERVAL_NEW_TURN, START_GAME, WAIT_FOR_OTHER_PLAYERS } from "./IntervalCanvas";

const IntervalCanvasHeader = ({ status = INTERVAL_INACTIVE }) => {   
    const {participants} = useGameStore()
    const nextDrawer = participants.find(participant => participant.is_painter)

    switch (status) {
        case INTERVAL_NEW_TURN:
            return (
                <>
                    <p className="text-[3rem] text-yellow-400">NEW TURN</p>
                    <p className="text-xl text-slate-400">It's the turn of <span className="text-slate-900">{nextDrawer?.nickname}</span></p>
                </>
            );
        case INTERVAL_INACTIVE:
            return (
                <>
                    <p className="text-[3rem] text-red-500">INACTIVE</p>
                    <p className="text-xl text-slate-400">You've lost your turn :(</p>
                </>
            );
        case WAIT_FOR_OTHER_PLAYERS:
        case START_GAME:
            return (
                <>
                    <p className="text-[3rem] text-yellow-400">WAITING</p>                    
                </>
            )
        default:
            return (
                <>
                    <p className="text-[3rem] text-sky-700">INTERVAL</p>
                    <p className="text-xl text-slate-400">Take a while to relax</p>
                </>
            );
    }
};

export default IntervalCanvasHeader;
