import IntervalCanvasContent from './IntervalCanvasContent'
import IntervalCanvasHeader from './IntervalCanvasHeader'
import {ProgressPlayTime} from './ProcessPlayTime'

export const INTERVAL_SHOW_WORD = 'interval-show-word'
export const INTERVAL_NOT_SHOW_WORD = 'interval-not-show-word'
export const INTERVAL_NEW_TURN = 'new-turn'
export const INTERVAL_INACTIVE = 'inactive'

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
