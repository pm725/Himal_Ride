import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckCircle2, AlertCircle, ShoppingCart, Award } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import type { BikeComponent, Configuration, ValidationResult } from '@/hooks/useConfigurator'

interface ConfiguratorSummaryProps {
  configuration: Configuration
  components: BikeComponent[]
  totalPrice: number
  totalWeight: number
  validationResult: ValidationResult | null
  isComplete: boolean
  onContinue: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  frame: 'Frame',
  motor: 'Motor',
  battery: 'Battery',
  suspension: 'Suspension',
  brakes: 'Brakes',
  wheels: 'Wheels',
}

export function ConfiguratorSummary({
  configuration,
  components,
  totalPrice,
  totalWeight,
  validationResult,
  isComplete,
}: ConfiguratorSummaryProps) {
  const { addItem } = useCartStore()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    addItem({
      configuration: configuration as unknown as Record<string, unknown>,
      quantity: 1,
      totalPrice,
      totalWeight,
    })
    navigate('/cart')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">Review Your Build</h2>
        <p className="text-muted-foreground">Confirm your configuration before adding to cart</p>
      </div>

      {/* Components list */}
      <div className="space-y-2">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const comp = configuration[key as keyof Configuration]
          return (
            <div
              key={key}
              className={`flex justify-between items-center px-4 py-3 rounded-lg ${comp ? 'bg-muted' : 'bg-muted/40 border border-dashed border-border'}`}
            >
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`font-medium text-sm ${comp ? '' : 'text-muted-foreground italic'}`}>
                  {comp ? comp.name : 'Not selected'}
                </p>
              </div>
              {comp && (
                <div className="text-right">
                  <p className="font-semibold text-sm text-primary">Rs. {comp.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{comp.weight} kg</p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Separator />

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Total Price</p>
          <p className="text-2xl font-bold text-primary">Rs. {totalPrice.toLocaleString()}</p>
        </div>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Total Weight</p>
          <p className="text-2xl font-bold">{totalWeight.toFixed(1)} kg</p>
        </div>
      </div>

      {/* Validation */}
      {validationResult && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            validationResult.is_valid
              ? 'bg-green-50 border-green-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          {validationResult.is_valid ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div>
            {validationResult.is_valid ? (
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-600" />
                <p className="font-semibold text-green-800 text-sm">
                  Compatibility Score: {validationResult.compatibility_score}%
                </p>
              </div>
            ) : (
              <p className="font-semibold text-amber-800 text-sm">Build incomplete</p>
            )}
            {validationResult.warnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-700 mt-1">{w}</p>
            ))}
            {validationResult.errors.map((e, i) => (
              <p key={i} className="text-xs text-amber-700 mt-1">{e}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button size="lg" onClick={handleAddToCart} disabled={!isComplete}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
