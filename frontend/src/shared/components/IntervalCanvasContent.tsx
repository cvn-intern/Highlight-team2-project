import AnswerHitImg from "@/shared/assets/answer-hit-img.png";
import NobodyHitsImg from "@/shared/assets/nobody-hits-answer.png";
import WaitingImg from "@/shared/assets/pencil-0.jpg";
import NewTurnUserImg from "@/shared/assets/new-turn-user.png";
import InactiveImage from "@/shared/assets/inactive.png"
import ControllerIcon from "@/shared/assets/controller-icon.svg";
import { INTERVAL_NEW_TURN, INTERVAL_NOT_SHOW_WORD, INTERVAL_SHOW_WORD, START_GAME, WAIT_FOR_OTHER_PLAYERS } from "./IntervalCanvas";
import { Button } from "./shadcn-ui/Button";

const IntervalCanvasContent = ({ status = INTERVAL_SHOW_WORD }) => {
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
        case INTERVAL_NOT_SHOW_WORD:
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
        case WAIT_FOR_OTHER_PLAYERS:
            return (
                <div className="flex flex-col items-center gap-y-3">
                    <div className="w-[70px] my-6 ">
                        <img src={WaitingImg} />
                    </div>
                    <div className="place-content-center flex flex-col">
                        <p className="text-[1.5rem] text-slate-300" > Wait for other players</p>
                    </div>
                </div>
            )
        case START_GAME:
            return (
                <div className="flex flex-col items-center gap-y-3">
                    <div className="w-[70px] my-1 ">
                        <img src={WaitingImg} />
                    </div>
                    <div className="place-content-center flex flex-col">
                        <p className="text-[1.5rem] text-slate-300" > Wait for other players</p>
                    </div>
                    <div className="place-content-center flex flex-col">
                        <Button
                            type="submit"
                            variant="opacityHover"
                            className="gap-4 rounded-full border-8 border-black font-black bg-[#FFE569] p-4"                            
                        >
                            <img src={ControllerIcon} alt="" className="w-[20%]" />
                            <p>START GAME</p>
                        </Button>
                    </div>
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
