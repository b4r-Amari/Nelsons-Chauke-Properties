
"use client";

import { cn } from "@/lib/utils";
import React from "react";

const Step = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-start gap-4", className)}
      {...props}
    />
  )
);
Step.displayName = "Step";

const StepIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("flex items-center justify-center h-12 w-12 rounded-full bg-brand-bright text-white shrink-0", className)}
        {...props}
      />
    )
  );
StepIcon.displayName = "StepIcon";

const StepLabel = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn("text-lg font-bold font-headline text-brand-deep", className)}
        {...props}
      />
    )
  );
StepLabel.displayName = "StepLabel";

const StepDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
      <p
        ref={ref}
        className={cn("text-muted-foreground mt-1", className)}
        {...props}
      />
    )
  );
StepDescription.displayName = "StepDescription";

const StepContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("pl-14", className)}
        {...props}
      />
    )
  );
StepContent.displayName = "StepContent";


export { Step, StepIcon, StepLabel, StepDescription, StepContent };
