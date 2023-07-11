// type Props = {}

export default function Main() {
  return (
    <div className="flex flex-col flex-1 h-full gap-6">
      <div className="flex-1 bg-white rounded-md overflow-hidden">
        <canvas id="canvas" className="inset-0">

        </canvas>
      </div>
      <div className="bg-white rounded-md h-[245px]">Chat and answers</div>
    </div>
  );
}
