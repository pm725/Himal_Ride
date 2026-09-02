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

  useEffect(() => {
    fetchCategories()
    CATEGORIES.forEach((cat) => fetchComponents(cat))
  }, [])

  const currentCategory = CATEGORIES[currentStep] || null
  const currentComponents = currentCategory ? componentsByCategory[currentCategory] || [] : []
  const selectedComponent = currentCategory ? configuration[currentCategory as keyof typeof configuration] as any : null

  const isReviewStep = currentStep === 7

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Build Your Bike
          </h1>
          <p className="text-muted-foreground">Customize every detail of your dream ride</p>
        </div>
        <button
          onClick={resetConfiguration}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset Build
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-4 text-center lg:col-span-1">
          <p className="text-sm text-muted-foreground">Total Price</p>
          <p className="text-2xl font-bold text-primary">Rs. {totalPrice.toLocaleString()}</p>
        </Card>
        <Card className="p-4 text-center lg:col-span-1">
          <p className="text-sm text-muted-foreground">Total Weight</p>
          <p className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</p>
        </Card>
        <Card className="p-4 text-center lg:col-span-1">
          <p className="text-sm text-muted-foreground">Components</p>
          <p className="text-2xl font-bold">{selectedComponents.length}/6</p>
        </Card>
        <Card className="p-4 text-center lg:col-span-1">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className={`text-lg font-semibold ${isComplete ? 'text-green-500' : 'text-yellow-500'}`}>
            {isComplete ? '✅ Complete' : '⏳ In Progress'}
          </p>
        </Card>
      </div>

      <Card className="p-6 md:p-8">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={8}
          steps={STEPS}
          isComplete={isComplete}
        />

        {isLoading && !isReviewStep ? (
          <div className="flex items-center justify-center py-16">
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

      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <span>Step {currentStep + 1} of 8</span>
        <span>{Math.round((currentStep + 1) / 8 * 100)}% complete</span>
      </div>
    </div>
  )
}