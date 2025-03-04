import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckboxGroupProps } from "./types";

export const CheckboxGroup: React.FC<
  React.PropsWithChildren<CheckboxGroupProps>
> = ({ children, className }) => {
  return (
    <div className={cn("flex w-full items-stretch gap-9", className)}>
      {children}
    </div>
  );
};
