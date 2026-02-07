import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const alertVariants = cva(
  "rounded-lg border p-4 text-sm flex items-start gap-3",
  {
    variants: {
      variant: {
        default:
          "border-zinc-700 bg-zinc-800/50 text-zinc-200",
        success:
          "border-lime-400/40 bg-lime-400/10 text-lime-200",
        error:
          "border-amber-500/40 bg-amber-500/10 text-amber-200",
        info:
          "border-zinc-600 bg-zinc-800/80 text-zinc-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, children, ...props }, ref) => {
  const showIcon = variant && variant !== "default";
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && (
        <AlertIcon variant={variant} />
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
});
Alert.displayName = "Alert";

const AlertIcon = ({ variant }: { variant?: "default" | "success" | "error" | "info" }) => {
  switch (variant) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 shrink-0 text-lime-400" />;
    case "error":
      return <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />;
    case "info":
      return <Info className="h-5 w-5 shrink-0 text-zinc-400" />;
    default:
      return null;
  }
};

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("leading-relaxed [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, AlertIcon, alertVariants };
