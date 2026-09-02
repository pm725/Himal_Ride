import { useEffect, useState } from 'react'
import { useConfiguratorStore } from '../stores/configuratorStore'
import { componentsApi, Component, ValidationResponse } from '../api/components'
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

export function useConfigurator() {
  const {
    configuration,
    selectedTerrain,
    validationResult,
    isLoading,
    currentStep,
    setComponent,
    setTerrain,
    setValidationResult,
    setLoading,
    nextStep,
    prevStep,
    setStep,
    getSelectedComponents,
    getTotalPrice,
    getTotalWeight,
    isComplete,
  } = useConfiguratorStore()

  const [componentsByCategory, setComponentsByCategory] = useState<Record<string, Component[]>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [isFetching, setIsFetching] = useState(false)

  // Fetch components for a specific category
  const fetchComponents = async (category: string) => {
    if (componentsByCategory[category]) return
    
    try {
      const components = await componentsApi.getComponents({ category })
      setComponentsByCategory((prev) => ({
        ...prev,
        [category]: components,
      }))
    } catch (error) {
      console.error(`Failed to fetch ${category}:`, error)
    }
  }

  // Fetch all categories
  const fetchCategories = async () => {
    if (categories.length > 0) return
    
    try {
      const result = await componentsApi.getCategories()
      setCategories(result)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // Validate the current configuration
  const validateConfiguration = async () => {
    const selectedComponents = getSelectedComponents()
    const componentIds = selectedComponents.map((c) => c.id)
    
    if (componentIds.length === 0) return
    
    setLoading(true)
    try {
      const result = await componentsApi.validateConfiguration(
        componentIds,
        selectedTerrain || undefined
      )
      setValidationResult(result)
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-validate when components change
  useEffect(() => {
    const selectedComponents = getSelectedComponents()
    if (selectedComponents.length >= 4) {
      const timer = setTimeout(() => {
        validateConfiguration()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [configuration, selectedTerrain])

  return {
    // State
    configuration,
    selectedTerrain,
    validationResult,
    isLoading: isLoading || isFetching,
    currentStep,
    componentsByCategory,
    categories,
    
    // Computed
    totalPrice: getTotalPrice(),
    totalWeight: getTotalWeight(),
    isComplete: isComplete(),
    selectedComponents: getSelectedComponents(),
    
    // Actions
    setComponent,
    setTerrain,
    nextStep,
    prevStep,
    setStep,
    fetchComponents,
    fetchCategories,
    validateConfiguration,
    resetConfiguration: useConfiguratorStore.getState().resetConfiguration,
  }
}