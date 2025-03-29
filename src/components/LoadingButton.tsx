import React from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  disabled = false,
  className = "",
  variant,
  ...props
}) => {
  return (
    <Button
      {...props}
      variant={variant}
      className={cn("flex items-center gap-2", className)}
      disabled={loading || disabled}
    >
      {loading && <Loader2 className="size-5 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
