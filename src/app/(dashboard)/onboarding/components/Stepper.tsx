import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <ol className="flex items-center gap-0" role="list" aria-label="Onboarding steps">
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        const isClickable = !!onStepClick && (isComplete || isActive);

        return (
          <li key={step} className="flex flex-1 items-center">
            <button
              type="button"
              onClick={() => isClickable && onStepClick?.(index)}
              disabled={!isClickable}
              aria-current={isActive ? "step" : undefined}
              className={cn(
                "flex w-full flex-col items-center gap-2 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 dark:focus-visible:ring-navy-400 focus-visible:ring-offset-2",
                isClickable ? "cursor-pointer" : "cursor-default"
              )}
            >
              {/* Circle */}
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                  isComplete && "border-navy-600 dark:border-primary bg-navy-600 dark:bg-primary text-white",
                  isActive && "border-navy-600 dark:border-primary bg-surface text-navy-700 dark:text-accent-blue shadow-sm",
                  !isComplete && !isActive && "border-ink-200 dark:border-ink-800 bg-surface text-ink-400 dark:text-ink-600"
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              {/* Label */}
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive && "text-navy-700 dark:text-accent-blue",
                  isComplete && "text-ink-600 dark:text-ink-300",
                  !isComplete && !isActive && "text-ink-400 dark:text-ink-600"
                )}
              >
                {step}
              </span>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 transition-colors",
                  index < currentStep ? "bg-navy-600 dark:bg-primary" : "bg-ink-200 dark:bg-ink-800"
                )}
                aria-hidden
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
