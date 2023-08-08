import {
  Circle,
  Edit,
  Eraser,
  Minus,
  PaintBucket,
  Pipette,
  Square,
  Triangle,
} from "lucide-react";
import {
  PEN_STYLE_BRUSH,
  PEN_STYLE_ERASER,
  PEN_STYLE_RECTANGLE,
  PEN_STYLE_CIRCLE,
  PEN_STYLE_TRIANGLE,
  PEN_STYLE_LINE,
  PEN_STYLE_BUCKET,
  PEN_STYLE_PICKER,
} from "@/applications/play/shared/constants/penStyles";

export const BUTTONS1 = [
  {
    Icon: Edit,
    penStyle: PEN_STYLE_BRUSH,
    type: "radio",
  },
  {
    Icon: Eraser,
    penStyle: PEN_STYLE_ERASER,
    type: "radio",
  },
  {
    Icon: Square,
    penStyle: PEN_STYLE_RECTANGLE,
    type: "radio",
  },
  {
    Icon: Circle,
    penStyle: PEN_STYLE_CIRCLE,
    type: "radio",
  },
  {
    Icon: Triangle,
    penStyle: PEN_STYLE_TRIANGLE,
    type: "radio",
  },
];

export const BUTTONS2 = [
  {
    Icon: Minus,
    penStyle: PEN_STYLE_LINE,
    type: "radio",
  },
  {
    Icon: PaintBucket,
    penStyle: PEN_STYLE_BUCKET,
    type: "radio",
  },
  {
    Icon: Pipette,
    penStyle: PEN_STYLE_PICKER,
    type: "radio",
  },
];
