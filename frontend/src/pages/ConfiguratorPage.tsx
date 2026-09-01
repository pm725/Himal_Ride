import { useEffect } from 'react'
import { useConfigurator } from '../hooks/useConfigurator'
import { StepIndicator } from '../components/configurator/StepIndicator'
import { ComponentStep } from '../components/configurator/ComponentStep'
import { ConfiguratorSummary } from '../components/configurator/ConfiguratorSummary'
import { Card } from '../components/ui/card'
import { Loader2 } from 'lucide-react'

const STEPS = [
  'Frame',
  'Motor',
  'Battery',
  'Suspension',
  'Brakes',
  'Wheels',
  'Finish',
  'Review',
]

const STEP_DESCRIPTIONS = [
  'Choose your bike frame material and size',
  'Select the motor power and type',
  'Pick the battery capacity',
  'Choose suspension travel and type',
  'Select your braking system',
  'Choose your wheel size and type',
  'Pick your bike finish color',
  'Review your custom build',
]

const CATEGORIES = ['frame', 'motor', 'battery', 'suspension', 'brakes', 'wheels']

export function ConfiguratorPage() {
  const {
    configuration,
    currentStep,
    componentsByCategory,
    isLoading,
    totalPrice,
    totalWeight,
    selectedComponents,
    isComplete,
    validationResult,
    setComponent,
    nextStep,
    prevStep,
    fetchComponents,
    fetchCategories,
    resetConfiguration,
  } = useConfigurator()

  // Fetch initial data
  useEffect(() => {
    fetchCategories()
    CATEGORIES.forEach((cat) => fetchComponents(cat))
  }, [])

  const currentCategory = CATEGORIES[currentStep] || null
  const currentComponents = currentCategory ? componentsByCategory[currentCategory] || [] : []
  const selectedComponent = currentCategory ? configuration[currentCategory as keyof typeof configuration] as any : null

  const isReviewStep = currentStep === 7

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Build Your Bike</h1>
        <button
          onClick={resetConfiguration}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Reset Build
        </button>
      </div>

      <Card className="p-6">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={8}
          steps={STEPS}
          isComplete={isComplete}
        />

        {isLoading && !isReviewStep ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : isReviewStep ? (
          <ConfiguratorSummary
          configuration={configuration}
            components={selectedComponents}
            totalPrice={totalPrice}
            totalWeight={totalWeight}
            validationResult={validationResult}
            isComplete={isComplete}
            onContinue={() => {
              // TODO: Add to cart logic
              console.log('Add to cart')
            }}
          />
        ) : (
          <ComponentStep
            title={STEPS[currentStep]}
            description={STEP_DESCRIPTIONS[currentStep]}
            category={currentCategory || ''}
            components={currentComponents}
            selectedComponent={selectedComponent}
            isLoading={isLoading}
            onSelect={(component) => {
              if (currentCategory) {
                setComponent(currentCategory as any, component)
              }
            }}
            onNext={nextStep}
            onPrev={prevStep}
            isFirst={currentStep === 0}
            isLast={currentStep === 6}
          />
        )}
      </Card>
    </div>
  )
}