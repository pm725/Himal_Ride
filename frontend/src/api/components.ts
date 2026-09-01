import { apiClient } from './client'

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

export interface ValidationRequest {
  component_ids: string[]
  terrain_profile_id?: string
}

export interface ValidationResponse {
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

export interface TerrainProfile {
  id: string
  name: string
  description: string
  terrain_type: string
  difficulty: number
  average_grade: number
  surface_roughness: number
  elevation_gain: number
  terrain_factor: number
  elevation_factor: number
  icon: string
  color: string
}

export const componentsApi = {
  // Get all components with optional filters
  getComponents: async (params?: {
    category?: string
    in_stock?: boolean
    limit?: number
    offset?: number
  }): Promise<Component[]> => {
    const response = await apiClient.get('/api/v1/components', { params })
    return response.data
  },

  // Get all categories
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get('/api/v1/components/categories')
    return response.data.categories
  },

  // Get a single component by ID
  getComponent: async (id: string): Promise<Component> => {
    const response = await apiClient.get(`/api/v1/components/${id}`)
    return response.data
  },

  // Validate a configuration
  validateConfiguration: async (
    componentIds: string[],
    terrainProfileId?: string
  ): Promise<ValidationResponse> => {
    const response = await apiClient.post('/api/v1/configurator/validate', {
      component_ids: componentIds,
      terrain_profile_id: terrainProfileId,
    })
    return response.data
  },
}

export const terrainApi = {
  // Get all terrain profiles
  getTerrainProfiles: async (): Promise<TerrainProfile[]> => {
    // Note: We'll need to add this endpoint in Phase 4
    // For now, we'll use a placeholder
    const response = await apiClient.get('/api/v1/terrain-profiles')
    return response.data
  },
}