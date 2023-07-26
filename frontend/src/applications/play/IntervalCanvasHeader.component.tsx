import { INTERVAL_INACTIVE, INTERVAL_NEW_TURN, INTERVAL_SHOW_WORD } from "./shared/constants/intervalStatus";

const IntervalCanvasHeader = ({ status = INTERVAL_SHOW_WORD }) => {   
    const userName = "User123"

    switch (status) {
        case INTERVAL_NEW_TURN:
            return (
                <>
                    <p className="text-[3rem] text-yellow-400">NEW TURN</p>
                    <p className="text-xl text-slate-400">It's the turn of <span className="text-slate-900">{userName}</span></p>
                </>
            );
        case INTERVAL_INACTIVE:
            return (
                <>
                    <p className="text-[3rem] text-red-500">INACTIVE</p>
                    <p className="text-xl text-slate-400">You've lost your turn :(</p>
                </>
            );
    }

    return (
        <>
            <p className="text-[3rem] text-sky-700">INTERVAL</p>
            <p className="text-xl text-slate-400">Take a while to relax</p>
        </>

    );
};


export default IntervalCanvasHeader;
