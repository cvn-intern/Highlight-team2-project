import { X } from "lucide-react";
import React from "react";

type Props = {};

export default function WordElement({}: Props) {
  return (
    <div className="p-1 h-8 rounded-[4px] w-fit border border-primary flex items-center gap-2 relative">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full border border-primary flexCenter bg-white cursor-pointer">
        <X size={16} />
      </div>
      <div className="h-5 w-1 bg-green-600 rounded-full"></div>
      <span className="tracking-widest font-semibold text-gray-400">
        hehehe
      </span>
    </div>
  );
}
