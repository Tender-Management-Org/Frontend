import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-4">
      <div className="h-2 w-full rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
      </div>

      <ol
        className="grid grid-cols-2 gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.min(steps.length, 3)}, minmax(0, 1fr))` }}
      >
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;
          const isClickable = !!onStepClick && (isComplete || isActive);

          return (
            <li
              key={step}
              className="list-none"
            >
              <button
                type="button"
                onClick={() => onStepClick?.(index)}
                disabled={!isClickable}
                className={cn(
                  "w-full rounded-lg border px-3 py-2 text-left text-sm font-medium",
                  isActive && "border-slate-900 bg-slate-900 text-white",
                  isComplete && "border-slate-300 bg-slate-100 text-slate-700",
                  !isActive && !isComplete && "border-border bg-white text-slate-400",
                  isClickable && "transition-colors hover:border-slate-400",
                  !isClickable && "cursor-not-allowed opacity-70"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                <p className="text-xs uppercase tracking-wide">Step {index + 1}</p>
                <p className="mt-1">{step}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
