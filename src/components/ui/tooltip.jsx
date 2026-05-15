import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

function Tooltip({
  delayDuration = 500,
  ...props
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props} />
    </TooltipPrimitive.Provider>
  );
}

function TooltipTrigger({ ...props }) {
  return <TooltipPrimitive.Root asChild {...props} />;
}

function TooltipContent({ className, sideOffset = 6, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        className={cn(
          "bg-sidebar text-sidebar-foreground z-50 overflow-hidden rounded-lg border px-3 py-1.5 text-xs shadow-lg animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        sideOffset={sideOffset}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent };