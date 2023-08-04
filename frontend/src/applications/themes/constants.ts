import { Option } from "@/shared/types/option";

export const DIFFICULTY_OPTIONS: Option[] = [
  {
    id: "easy",
    value: "easy",
    label: "Easy",
    radioButtonClassName: "text-green-600",
  },
  {
    id: "medium",
    value: "medium",
    label: "Medium",
    radioButtonClassName: "text-yellow-600",
  },
  {
    id: "hard",
    value: "hard",
    label: "Hard",
    radioButtonClassName: "text-red-600",
  },
];
