
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof alertVariants> {
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const Alert = React.forwardRef<
  HTMLDivElement,
  AlertProps
>(({ className, variant, children, onClose, autoClose = true, autoCloseDelay = 3000, ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoClose && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className, "pr-10")}
      {...props}
    >
      {children}
      <button 
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
        aria-label="Close alert"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
