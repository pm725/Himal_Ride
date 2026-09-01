import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Component {
  id: string
  sku: string
  category: string
  name: string
  description: string
  base_price: number
  weight_kg: number
  image_url: string
  inventory_count: number
  is_active: boolean
  specs: Record<string, any>
}

export interface Configuration {
  frame: Component | null
  motor: Component | null
  battery: Component | null
  suspension: Component | null
  brakes: Component | null
  wheels: Component | null
  finish: string | null
  accessories: string[]
}

export interface ValidationResult {
  total_price: number
  total_weight: number
  estimated_range: number
  compatibility_score: number
  warnings: string[]
  is_valid: boolean
  terrain_compatibility?: {
    range_on_terrain: number
    terrain_factor: number
    difficulty_rating: number
  }
}

interface ConfiguratorState {
  configuration: Configuration
  selectedTerrain: string | null
  validationResult: ValidationResult | null
  isLoading: boolean
  currentStep: number
  
  // Actions
  setComponent: (category: keyof Configuration, component: Component | null) => void
  setFinish: (finish: string) => void
  toggleAccessory: (accessory: string) => void
  setTerrain: (terrainId: string) => void
  setValidationResult: (result: ValidationResult) => void
  setLoading: (isLoading: boolean) => void
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  resetConfiguration: () => void
  getSelectedComponents: () => Component[]
  getTotalPrice: () => number
  getTotalWeight: () => number
  isComplete: () => boolean
}

const initialConfiguration: Configuration = {
  frame: null,
  motor: null,
  battery: null,
  suspension: null,
  brakes: null,
  wheels: null,
  finish: null,
  accessories: [],
}

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set, get) => ({
      configuration: initialConfiguration,
      selectedTerrain: null,
      validationResult: null,
      isLoading: false,
      currentStep: 0,

      setComponent: (category, component) => {
        set((state) => ({
          configuration: {
            ...state.configuration,
            [category]: component,
          },
        }))
        // Reset validation when component changes
        set({ validationResult: null })
      },

      setFinish: (finish) => {
        set((state) => ({
          configuration: {
            ...state.configuration,
            finish,
          },
        }))
      },

      toggleAccessory: (accessory) => {
        set((state) => {
          const current = state.configuration.accessories
          const updated = current.includes(accessory)
            ? current.filter((a) => a !== accessory)
            : [...current, accessory]
          return {
            configuration: {
              ...state.configuration,
              accessories: updated,
            },
          }
        })
      },

      setTerrain: (terrainId) => {
        set({ selectedTerrain: terrainId })
      },

      setValidationResult: (result) => {
        set({ validationResult: result })
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      setStep: (step) => {
        set({ currentStep: step })
      },

      nextStep: () => {
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 7),
        }))
      },

      prevStep: () => {
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0),
        }))
      },

      resetConfiguration: () => {
        set({
          configuration: initialConfiguration,
          selectedTerrain: null,
          validationResult: null,
          currentStep: 0,
        })
      },

      getSelectedComponents: () => {
        const { configuration } = get()
        return Object.values(configuration)
          .filter((val): val is Component => 
            val !== null && typeof val === 'object' && 'id' in val
          )
      },

      getTotalPrice: () => {
        const components = get().getSelectedComponents()
        return components.reduce((sum, c) => sum + c.base_price, 0)
      },

      getTotalWeight: () => {
        const components = get().getSelectedComponents()
        return components.reduce((sum, c) => sum + c.weight_kg, 0)
      },

      isComplete: () => {
        const { configuration } = get()
        return !!(
          configuration.frame &&
          configuration.motor &&
          configuration.battery &&
          configuration.wheels &&
          configuration.brakes
        )
      },
    }),
    {
      name: 'himal-ride-configurator',
      partialize: (state) => ({
        configuration: state.configuration,
        selectedTerrain: state.selectedTerrain,
        currentStep: state.currentStep,
      }),
    }
  )
)