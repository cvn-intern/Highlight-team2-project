import { cn } from "@/shared/lib/utils";
import { X } from "lucide-react";

type Props = {
  word: WordType;
  index: number;
  handleDeleteWord: (index: number) => void;
};

export default function WordElement({ word, index, handleDeleteWord }: Props) {
  return (
    <div className="p-1 h-8 rounded-[4px] w-fit border border-primary flex items-center gap-2 relative bg-white">
      <div
        className="absolute top-0 right-0 w-6 h-6 translate-x-1/2 -translate-y-1/2 bg-white border rounded-full cursor-pointer border-primary flexCenter"
        onClick={() => {
          handleDeleteWord(index);
        }}
      >
        <X size={16} />
      </div>
      <div
        className={cn("h-6 w-2 rounded-full", {
          "bg-green-500": word.difficulty === "easy",
          "bg-yellow-500": word.difficulty === "medium",
          "bg-red-500": word.difficulty === "hard",
        })}
      ></div>
      <span className="font-semibold tracking-widest text-gray-400">
        {word.word}
      </span>
    </div>
  );
}
