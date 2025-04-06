import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaletteIcon } from "lucide-react";
import React, { useState } from "react";
import { Color, ColorChangeHandler, TwitterPicker } from "react-color";
import { useSubscriptionLevel } from "../resumes/SubscriptionLevelProvider";
import usePremiumModal from "@/app/hooks/usePremiumModal";
import { canUseDesignCustomizations } from "@/lib/permissions";

interface ColorPickerProps {
  color: Color | undefined;
  onChange: ColorChangeHandler;
}
const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  const [showPopOver, setShowPopOver] = useState(false);
  const subscriptionLevel = useSubscriptionLevel();
  const { setOpen } = usePremiumModal();
  return (
    <Popover open={showPopOver} onOpenChange={setShowPopOver}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => {
            if (!canUseDesignCustomizations(subscriptionLevel)) {
              setOpen(true);
              return;
            }
            setShowPopOver(true);
          }}
          variant={"outline"}
          size={"icon"}
          title="Change Resume Color"
        >
          <PaletteIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="border-none bg-transparent shadow-none"
      >
        <TwitterPicker color={color} onChange={onChange} triangle="top-right" />
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;
