import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
  isComplete: boolean
}

export function StepIndicator({ currentStep, totalSteps, steps, isComplete }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative flex items-center w-full">
              {/* Line connecting steps */}
              {index > 0 && (
                <div
                  className={`absolute left-0 w-full h-0.5 -translate-x-1/2 ${
                    index <= currentStep || isComplete
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                  style={{ left: '50%', width: 'calc(100% - 0px)' }}
                />
              )}
              
              {/* Step circle */}
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index < currentStep || (index === currentStep && isComplete)
                    ? 'bg-primary border-primary text-primary-foreground'
                    : index === currentStep
                    ? 'border-primary text-primary'
                    : 'border-muted text-muted-foreground'
                }`}
              >
                {index < currentStep || (index === currentStep && isComplete) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
            </div>
            
            {/* Step label */}
            <span
              className={`mt-2 text-xs font-medium ${
                index <= currentStep || isComplete
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}