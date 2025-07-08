import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium shadow transition hover:bg-gray-800 focus:outline-none",
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };
