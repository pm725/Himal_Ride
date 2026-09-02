import { Check } from 'lucide-react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
  isComplete: boolean
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-1 min-w-[2.5rem]">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                index < currentStep
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : index === currentStep
                  ? 'border-2 border-primary text-primary bg-primary/5'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index < currentStep ? <Check className="w-3.5 h-3.5" /> : index + 1}
            </div>
            <span
              className={`hidden md:block text-[10px] font-medium text-center whitespace-nowrap ${
                index === currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
      {/* Track */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-3">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
