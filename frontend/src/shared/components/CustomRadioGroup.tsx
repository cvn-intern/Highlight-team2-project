import { Dispatch, SetStateAction } from "react";
import { Option } from "../types/option";
import { RadioGroup, RadioGroupItem } from "./shadcn-ui/radio-group";
import { Label } from "@radix-ui/react-label";
import { cn } from "../lib/utils";
import { useTranslation } from "react-i18next";

type Props = {
  options: Option[];
  state: string;
  setState: Dispatch<SetStateAction<string>>;
};

export default function CustomRadioGroup({ options, state, setState }: Props) {
  const { t } = useTranslation();
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
            <RadioGroupItem
              value={option.value}
              id={option.id}
              className={cn({
                "text-green-600": option.value === "easy",
                "text-yellow-600": option.value === "medium",
                "text-red-600": option.value === "hard",
              })}
            />
            <Label
              htmlFor={option.id}
              className="text-sm font-semibold text-gray-400"
            >
              {t("CreateTheme." + option.label)}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}
