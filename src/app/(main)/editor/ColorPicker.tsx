import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PaletteIcon } from "lucide-react";
import React, { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}
const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [showPopOver, setShowPopOver] = useState(false);
  return (
    <Popover open={showPopOver} onOpenChange={setShowPopOver}>
      <PopoverTrigger asChild>
        <Button onClick={() => setShowPopOver(true)} variant={"outline"} size={"icon"} title="Change Resume Color">
            <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="border-none bg-transparent shadow-none">
        <TwitterPicker color={color} onChange={onChange} triangle="top-right" />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
