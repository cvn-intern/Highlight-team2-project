import { Dispatch, SetStateAction } from "react";
import { Option } from "../types/option";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "@radix-ui/react-label";

type Props = {
  options: Option[];
  state: string;
  setState: Dispatch<SetStateAction<string>>;
};

export default function CustomRadioGroup({ options, state, setState }: Props) {
  return (
    <RadioGroup
      defaultValue={options[0].value}
      className="flex gap-2"
      value={state}
      onValueChange={(value) => {
        setState(value);
      }}
    >
      {options.map((option) => {
        return (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={option.id} />
            <Label
              htmlFor={option.id}
              className="lowercase text-sm font-semibold text-gray-400"
            >
              {option.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
