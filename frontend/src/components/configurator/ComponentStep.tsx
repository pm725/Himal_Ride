import { useEffect } from 'react'
import { Component } from '../../stores/configuratorStore'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Check, Loader2 } from 'lucide-react'

interface ComponentStepProps {
  title: string
  description: string
  category: string
  components: Component[]
  selectedComponent: Component | null
  isLoading: boolean
  onSelect: (component: Component | null) => void
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
}

export function ComponentStep({
  title,
  description,
  category,
  components,
  selectedComponent,
  isLoading,
  onSelect,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: ComponentStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((component) => (
            <Card
              key={component.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedComponent?.id === component.id
                  ? 'ring-2 ring-primary'
                  : ''
              }`}
              onClick={() => onSelect(component)}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{component.name}</h3>
                  {selectedComponent?.id === component.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
                {component.image_url && (
                  <img
                    src={component.image_url}
                    alt={component.name}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {component.description}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">Rs. {component.base_price.toLocaleString()}</Badge>
                    <Badge variant="secondary">{component.weight_kg} kg</Badge>
                  </div>
                  {component.inventory_count < 5 && (
                    <Badge variant="destructive" className="text-xs">
                      Low Stock
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirst}
        >
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedComponent}
        >
          {isLast ? 'Review Build' : 'Next'}
        </Button>
      </div>
    </div>
  )
}