import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '../api/client'

// ─── Types ──────────────────────────────────────────────────
export interface BikeComponent {
  id: string
  name: string
  price: number
  weight: number
  category: string
  stock: number
  description: string
  image_url?: string
}

export interface Configuration {
  frame: BikeComponent | null
  motor: BikeComponent | null
  battery: BikeComponent | null
  suspension: BikeComponent | null
  brakes: BikeComponent | null
  wheels: BikeComponent | null
}

export interface ValidationResult {
  is_valid: boolean
  compatibility_score: number
  warnings: string[]
  errors: string[]
  total_price?: number
  total_weight?: number
  estimated_range?: number
}

// ─── Hook ──────────────────────────────────────────────────
export function useConfigurator() {
  const [configuration, setConfiguration] = useState<Configuration>({
    frame: null,
    motor: null,
    battery: null,
    suspension: null,
    brakes: null,
    wheels: null,
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [componentsByCategory, setComponentsByCategory] = useState<Record<string, BikeComponent[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  // ── Fetch components for a category ──────────────────────
  const fetchComponents = useCallback(async (category: string) => {
    setIsLoading(true)
    try {
      const res = await apiClient.get('/api/v1/components', {
        params: { category, limit: 100 },
      })
      const raw = res.data || []
      const mapped: BikeComponent[] = raw.map((c: any) => ({
        id: c.id,
        name: c.name,
        price: c.base_price,
        weight: c.weight_kg,
        category: c.category,
        stock: c.inventory_count,
        description: c.description || '',
        image_url: c.image_url,
      }))
      setComponentsByCategory((prev) => ({ ...prev, [category]: mapped }))
    } catch (err) {
      console.error('Failed to fetch components for', category, err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // ── Fetch categories ──────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    // Optional: fetch from /api/v1/components/categories
    // Using static list from configurator steps
    return Promise.resolve()
  }, [])

  // ── Validate configuration ──────────────────────────────
  const validateConfiguration = useCallback(async () => {
    const selected = Object.values(configuration).filter((c) => c !== null) as BikeComponent[]
    const componentIds = selected.map((c) => c.id)

    if (componentIds.length === 0) {
      setValidationResult(null)
      return
    }

    setIsLoading(true)
    try {
      const res = await apiClient.post('/api/v1/configurator/validate', {
        component_ids: componentIds,
      })
      const data = res.data
      setValidationResult({
        is_valid: data.is_valid,
        compatibility_score: data.compatibility_score,
        warnings: data.warnings || [],
        errors: data.is_valid ? [] : ['Configuration needs adjustment'],
        total_price: data.total_price,
        total_weight: data.total_weight,
        estimated_range: data.estimated_range,
      })
    } catch (err) {
      console.error('Validation failed', err)
    } finally {
      setIsLoading(false)
    }
  }, [configuration])

  // ── Auto-validate ──────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      validateConfiguration()
    }, 400)
    return () => clearTimeout(timer)
  }, [configuration, validateConfiguration])

  // ── Setters ──────────────────────────────────────────────
  const setComponent = useCallback((category: keyof Configuration, component: BikeComponent) => {
    setConfiguration((prev) => ({ ...prev, [category]: component }))
  }, [])

  const nextStep = () => setCurrentStep((p) => Math.min(p + 1, 7))
  const prevStep = () => setCurrentStep((p) => Math.max(p - 1, 0))
  const resetConfiguration = () => {
    setConfiguration({
      frame: null,
      motor: null,
      battery: null,
      suspension: null,
      brakes: null,
      wheels: null,
    })
    setCurrentStep(0)
    setValidationResult(null)
  }

  // ── Computed values ──────────────────────────────────────
  const selectedComponents = Object.values(configuration).filter(Boolean) as BikeComponent[]
  const totalPrice = selectedComponents.reduce((s, c) => s + c.price, 0)
  const totalWeight = selectedComponents.reduce((s, c) => s + c.weight, 0)
  const isComplete = selectedComponents.length === 6

  return {
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
  }
}