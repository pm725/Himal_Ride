import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { BikeComponent } from '@/hooks/useConfigurator'

interface ComponentStepProps {
  title: string
  description: string
  category: string
  components: BikeComponent[]
  selectedComponent: BikeComponent | null
  isLoading: boolean
  onSelect: (component: BikeComponent) => void
  onNext: () => void
  onPrev: () => void
  isFirst: boolean
  isLast: boolean
}

/* Finish colour palette for step 6 (no API components) */
const FINISH_OPTIONS = [
  { id: 'fin-black', name: 'Matte Black', hex: '#1c1917', price: 0 },
  { id: 'fin-blue', name: 'Himalayan Blue', hex: '#1e3a6e', price: 0 },
  { id: 'fin-orange', name: 'Summit Orange', hex: '#d4600a', price: 0 },
  { id: 'fin-white', name: 'Alpine White', hex: '#f0ece6', price: 0 },
  { id: 'fin-red', name: 'Nepali Red', hex: '#c12b2b', price: 0 },
  { id: 'fin-green', name: 'Forest Olive', hex: '#4a5e3a', price: 0 },
]

export function ComponentStep({
  title,
  description,
  components,
  selectedComponent,
  isLoading,
  onSelect,
  onNext,
  onPrev,
  isFirst,
  isLast,
}: ComponentStepProps) {
  const [selectedFinish, setSelectedFinish] = useState(FINISH_OPTIONS[0].id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  /* Step 6 — Finish selector */
  if (components.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {FINISH_OPTIONS.map((finish) => (
            <button
              key={finish.id}
              onClick={() => setSelectedFinish(finish.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all hover:shadow-sm ${
                selectedFinish === finish.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
              }`}
            >
              <div
                className="w-10 h-10 rounded-full border border-border/40 shadow-inner"
                style={{ backgroundColor: finish.hex }}
              />
              <span className="text-xs font-medium text-center">{finish.name}</span>
            </button>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          Your selected finish will be applied at our workshop. Our team will confirm the final colour before production.
        </p>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev} disabled={isFirst}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button onClick={onNext}>
            Review Build
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {components.map((component) => {
          const isSelected = selectedComponent?.id === component.id
          return (
            <Card
              key={component.id}
              onClick={() => onSelect(component)}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary bg-primary/5 border-primary/30' : 'hover:border-border/80'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm leading-tight">{component.name}</h3>
                {isSelected && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shrink-0 ml-2">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{component.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-primary">Rs. {component.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs">{component.weight} kg</span>
              </div>
              {component.stock <= 3 && (
                <p className="text-xs text-amber-600 mt-2 font-medium">Only {component.stock} left</p>
              )}
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onPrev} disabled={isFirst}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
        <Button onClick={onNext} disabled={!selectedComponent}>
          {isLast ? 'Review Build' : 'Next Step'}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
