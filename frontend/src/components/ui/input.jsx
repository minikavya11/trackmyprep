import * as React from "react";
import { cn } from "../../lib/utils";

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
