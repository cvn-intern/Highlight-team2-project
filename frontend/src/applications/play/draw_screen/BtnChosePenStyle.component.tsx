import classNames from "classnames";
import { LucideIcon } from "lucide-react";
type Props = {
  Icon: LucideIcon | string;
  onChange: () => void;
  name?: string;
  value: string;
  active: boolean;
  type: "radio" | "checkbox";
};

export default function BtnChosePenStyle({
  Icon,
  onChange,
  name = "penStyle",
  value,
  active = false,
  type,
}: Props) {
  return (
    <label htmlFor={value} className="bg-white flexCenter cursor-pointer">
      <input
        type={type}
        name={name}
        id={value}
        checked={active}
        onChange={onChange}
        className="hidden"
      />
      {typeof Icon === "string" && (
        <span
          className={`${classNames(
            "text-xl",
            { "text-[#ffc26f] font-bold": active },
            { "text-[#848484] font-semibold": !active }
          )}`}
        >
          {Icon}
        </span>
      )}
      {typeof Icon !== "string" && (
        <Icon
          color={active ? "#ffc26f" : "#848484"}
          size={28}
          strokeWidth={active ? 2.25 : 2}
        />
      )}
    </label>
  );
}
