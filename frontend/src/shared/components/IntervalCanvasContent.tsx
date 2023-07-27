import AnswerHitImg from "@/shared/assets/answer-hit-img.png";
import NobodyHitsImg from "@/shared/assets/nobody-hits-answer.png";
import NewTurnUserImg from "@/shared/assets/new-turn-user.png";
import InactiveImage from "@/shared/assets/inactive.png"
import { INTERVAL_NEW_TURN, INTERVAL_NOT_SHOW_WORD, INTERVAL_SHOW_WORD } from "./IntervalCanvas";


const IntervalCanvasContent = ({status = INTERVAL_SHOW_WORD }) => {
    switch (status) {
        case INTERVAL_SHOW_WORD:
            return (
                <div className="flex justify-between gap-x-20 ">
                    <div className="flex flex-col items-center place-content-center">
                        <p className="text-lg text-slate-300">The answer was:</p>
                        <p className="text-[2.5rem]">Animal</p>
                    </div>
                    <div className="w-[180px] mt-9 ">
                        <img src={AnswerHitImg} />
                    </div>
                    <div className="place-content-center flex flex-col">
                        <p className="text-[3.5rem]" > <span className="text-cyan-700">7</span>/<span>15</span></p>
                    </div>
                </div>
            );
        case INTERVAL_NOT_SHOW_WORD :
            return (
                <div className="flex flex-col items-center gap-y-3">
                    <div className="w-[130px] mt-5 ">
                        <img src={NobodyHitsImg} />
                    </div>
                    <div className="place-content-center flex flex-col">
                        <p className="text-[1.5rem] text-slate-300" > Nobody hits the answer :(</p>
                    </div>
                </div>
            );
        case INTERVAL_NEW_TURN:
            return (
                <div className="flex items-center mt-7">
                    <img className="w-[200px]" src={NewTurnUserImg} />
                </div>
            )
        default:
            return (
                <div className="flex items-center mt-7">
                    <img className="w-[200px]" src={InactiveImage} />
                </div>
            )
    }

    
};


export default IntervalCanvasContent;
