import { Option } from "@/shared/types/option";

export const DIFFICULTY_OPTIONS: Option[] = [
  {
    id: "easy",
    value: "easy",
    label: "easy",
    radioButtonClassName: "text-green-600",
  },
  {
    id: "medium",
    value: "medium",
    label: "medium",
    radioButtonClassName: "text-yellow-600",
  },
  {
    id: "hard",
    value: "hard",
    label: "hard",
    radioButtonClassName: "text-red-600",
  },
];
