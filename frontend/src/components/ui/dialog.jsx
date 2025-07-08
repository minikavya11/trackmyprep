import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "../../lib/utils";
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;


const Dialog = ({ children, ...props }) => (
  <DialogPrimitive.Root {...props}>
    {children}
  </DialogPrimitive.Root>
);

const DialogTrigger = DialogPrimitive.Trigger;

const DialogContent = ({ children, ...props }) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-40" />
    <DialogPrimitive.Content
      className={cn(
        "fixed z-50 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none",
        props.className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);


export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription
};
