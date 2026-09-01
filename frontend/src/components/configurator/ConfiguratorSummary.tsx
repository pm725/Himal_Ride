import { Component, ValidationResult } from '../../stores/configuratorStore'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import { Bike, Weight, Ruler, AlertCircle, CheckCircle2 } from 'lucide-react'

interface ConfiguratorSummaryProps {
  components: Component[]
  totalPrice: number
  totalWeight: number
  validationResult: ValidationResult | null
  isComplete: boolean
  onContinue: () => void
}

const categoryLabels: Record<string, string> = {
  frame: 'Frame',
  motor: 'Motor',
  battery: 'Battery',
  suspension: 'Suspension',
  brakes: 'Brakes',
  wheels: 'Wheels',
  finish: 'Finish',
}

export function ConfiguratorSummary({
  components,
  totalPrice,
  totalWeight,
  validationResult,
  isComplete,
  onContinue,
}: ConfiguratorSummaryProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Build Summary</h2>
        <p className="text-muted-foreground">Review your custom bike configuration</p>
      </div>

      {/* Component List */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Selected Components</h3>
        <div className="space-y-3">
          {components.map((component) => (
            <div key={component.id} className="flex justify-between items-center">
              <div>
                <Badge variant="outline" className="mr-2">
                  {categoryLabels[component.category] || component.category}
                </Badge>
                <span>{component.name}</span>
              </div>
              <div className="flex gap-4 text-sm">
                <span>Rs. {component.base_price.toLocaleString()}</span>
                <span className="text-muted-foreground">{component.weight_kg} kg</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Bike className="w-4 h-4" />
            <span>Total Price</span>
          </div>
          <p className="text-2xl font-bold mt-2">Rs. {totalPrice.toLocaleString()}</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Weight className="w-4 h-4" />
            <span>Total Weight</span>
          </div>
          <p className="text-2xl font-bold mt-2">{totalWeight.toFixed(1)} kg</p>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Ruler className="w-4 h-4" />
            <span>Est. Range</span>
          </div>
          <p className="text-2xl font-bold mt-2">
            {validationResult?.estimated_range?.toFixed(1) || 'N/A'} km
          </p>
        </Card>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <Card className={`p-4 ${validationResult.is_valid ? 'border-green-500' : 'border-yellow-500'}`}>
          <div className="flex items-center gap-2 mb-2">
            {validationResult.is_valid ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500" />
            )}
            <span className="font-semibold">
              {validationResult.is_valid ? 'Build Ready' : 'Compatibility Issues'}
            </span>
            <span className="ml-auto text-sm">
              Score: {validationResult.compatibility_score}%
            </span>
          </div>
          
          <Progress value={validationResult.compatibility_score} className="mb-2" />
          
          {validationResult.warnings.length > 0 && (
            <div className="mt-2">
              {validationResult.warnings.map((warning, index) => (
                <p key={index} className="text-sm text-yellow-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {warning}
                </p>
              ))}
            </div>
          )}
          
          {validationResult.terrain_compatibility && (
            <div className="mt-3 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium">Terrain Compatibility</p>
              <p className="text-sm text-muted-foreground">
                Range on terrain: {validationResult.terrain_compatibility.range_on_terrain.toFixed(1)} km
                <span className="ml-2">
                  (Factor: {validationResult.terrain_compatibility.terrain_factor})
                </span>
              </p>
            </div>
          )}
        </Card>
      )}

      <Separator />

      <div className="flex justify-end">
        <Button
          onClick={onContinue}
          disabled={!isComplete || !validationResult?.is_valid}
          size="lg"
        >
          {validationResult?.is_valid ? 'Add to Cart' : 'Complete Build First'}
        </Button>
      </div>
    </div>
  )
}