import { Button } from "@/components/ui/button";
import { Circle, Square, Squircle } from "lucide-react";
import React from "react";

interface BorderStyleButtonProps {
  borderStyle: string | undefined;
  onChange: (borderStyle: string) => void;
}

export const BorderStyles = {
  SQUARE: "square",
  CIRCLE: "circle",
  SQUIRCLE: "squircle",
};
const borderStyles = Object.values(BorderStyles);
const BorderStyleButton = ({
  borderStyle,
  onChange,
}: BorderStyleButtonProps) => {
  function handleClick() {
    const currentIndex = borderStyle ? borderStyles.indexOf(borderStyle) : 0;
    const nextIndex = (currentIndex + 1) % borderStyles.length;
    onChange(borderStyles[nextIndex]);
  }

  const Icon =
    borderStyle === "sqaure"
      ? Square
      : borderStyle === "circle"
      ? Circle
      : Squircle;

  return (
    <Button
      size={"icon"}
      onClick={handleClick}
      variant={"outline"}
      title="Change Border Style"
    >
        <Icon className="size-5"/>
    </Button>
  );
};

export default BorderStyleButton;
