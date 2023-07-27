import { ProgressPlayTime } from "@/shared/components/ProcessPlayTime";
import IntervalCanvasHeader from "./IntervalCanvasHeader.component";
import IntervalCanvasContent from "./IntervalCanvasContent.component";
import { INTERVAL_SHOW_WORD } from "./shared/constants/intervalStatus";

const IntervalCanvas = ({ status=INTERVAL_SHOW_WORD, hidden=true }) => {
    return (
        <div hidden={hidden} id="interval-layout" className={`relative overflow-hidden rounded-[10px] w-[760px] aspect-[2] flex-shrink-0 bg-white bg-no-repeat bg-center`}>
            <div className="flex flex-col items-center font-lilita">
                <IntervalCanvasHeader status={status} />
                <IntervalCanvasContent status={status} />
            </div>
            <ProgressPlayTime step={0.06} />
        </div>
    );

};


export default IntervalCanvas;