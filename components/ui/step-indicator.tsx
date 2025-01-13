"use client";

import { cn } from "@/lib/utils";

import { CheckIcon } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: {
    name: string;
    description: string;
  }[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  steps,
  onStepClick,
}: StepIndicatorProps) {
  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="relative">
      {/* Desktop view - vertical timeline */}
      <div className="hidden md:block">
        <div className="flex flex-col relative">
          {/* Timeline line */}
          <div
            className="absolute left-6 top-10 w-0.5 bg-gray-200"
            style={{ height: `calc(100% - 6rem)` }}
          />

          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = stepNumber < currentStep;
            const isClickable = stepNumber <= currentStep || isCompleted;

            return (
              <div
                key={step.name}
                className={cn(
                  "relative pl-12 py-8 cursor-pointer transition-colors",
                  isClickable
                    ? "hover:bg-gray-50"
                    : "cursor-not-allowed opacity-60"
                )}
                onClick={() => isClickable && onStepClick?.(stepNumber)}
              >
                <div
                  className={cn(
                    "absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all",
                    isCompleted
                      ? "bg-green-600 text-white"
                      : isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {isCompleted ? <CheckIcon className="h-6 w-6" /> : stepNumber}
                </div>

                <div className="space-y-1">
                  <div
                    className={cn(
                      "font-medium ml-3 mt-3",
                      isActive ? "text-blue-600" : "text-gray-900"
                    )}
                  >
                    {step.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile view - simple step counter with progress */}
      <div className="md:hidden text-center">
        <div className="inline-flex items-center gap-2 text-base font-medium">
          <span className="text-blue-600">{currentStep}</span>
          <span className="text-gray-400">of</span>
          <span className="text-gray-600">{steps.length}</span>
        </div>
        <div className="mt-2 relative h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
