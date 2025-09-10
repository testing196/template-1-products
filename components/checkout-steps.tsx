import { Check } from "lucide-react"

interface Step {
  number: number
  title: string
  description: string
}

interface CheckoutStepsProps {
  steps: Step[]
  currentStep: number
}

export function CheckoutSteps({ steps, currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step.number < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : step.number === currentStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground"
              }`}
            >
              {step.number < currentStep ? <Check className="h-5 w-5" /> : step.number}
            </div>
            <div className="ml-3">
              <p className={`font-medium ${step.number <= currentStep ? "text-foreground" : "text-muted-foreground"}`}>
                {step.title}
              </p>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${step.number < currentStep ? "bg-primary" : "bg-muted"}`} />
          )}
        </div>
      ))}
    </div>
  )
}
