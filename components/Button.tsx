import { CircularProgress } from "@mui/material";
import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "default" | "destructive";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({
  children,
  variant = "default",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyle = "px-4 py-2 rounded text-white font-medium flex items-center justify-center";
  const variants = {
    default: "bg-blue-500 hover:bg-blue-600",
    destructive: "bg-red-500 hover:bg-red-600",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function LoadingButton() {
  return (
    <button
      disabled
      className="px-4 py-2 rounded text-white font-medium flex items-center justify-center bg-blue-500 w-full"
    >
      <CircularProgress size={20} sx={{ color: "white" }} />
    </button>
  );
}
