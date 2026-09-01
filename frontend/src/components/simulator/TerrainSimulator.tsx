import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import { Mountain, Bike, Gauge, Thermometer, AlertCircle } from 'lucide-react'
import { apiClient } from '../../api/client'

interface TerrainProfile {
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

interface TerrainSimulatorProps {
  onTerrainSelect: (terrainId: string) => void
  selectedTerrainId: string | null
  componentIds: string[]
}

export function TerrainSimulator({
  onTerrainSelect,
  selectedTerrainId,
  componentIds,
}: TerrainSimulatorProps) {
  const [profiles, setProfiles] = useState<TerrainProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [simulationResults, setSimulationResults] = useState<Record<string, any>>({})

  useEffect(() => {
    fetchTerrainProfiles()
  }, [])

  const fetchTerrainProfiles = async () => {
    try {
      const response = await apiClient.get('/api/v1/terrain-profiles')
      setProfiles(response.data)
    } catch (error) {
      console.error('Failed to fetch terrain profiles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTerrainSelect = (profile: TerrainProfile) => {
    onTerrainSelect(profile.id)
    // Trigger validation with terrain
    // The configurator hook will handle this
  }

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['Very Easy', 'Easy', 'Moderate', 'Hard', 'Very Hard']
    return labels[difficulty - 1] || 'Unknown'
  }

  const getDifficultyColor = (difficulty: number) => {
    const colors = ['bg-green-500', 'bg-green-400', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500']
    return colors[difficulty - 1] || 'bg-gray-500'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Terrain Simulator</h3>
        <p className="text-sm text-muted-foreground">
          Select a terrain profile to see how your build performs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card
            key={profile.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedTerrainId === profile.id
                ? 'ring-2 ring-primary'
                : ''
            }`}
            onClick={() => handleTerrainSelect(profile)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{profile.icon}</span>
                <div>
                  <h4 className="font-semibold">{profile.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {profile.terrain_type}
                  </Badge>
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs text-white ${getDifficultyColor(profile.difficulty)}`}>
                {getDifficultyLabel(profile.difficulty)}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {profile.description}
            </p>

            <div className="mt-3 grid grid-cols-2 gap-1 text-xs">
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                <span>Grade: {profile.average_grade}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Mountain className="w-3 h-3" />
                <span>Elev: {profile.elevation_gain}m</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <Thermometer className="w-3 h-3" />
                <span>Roughness: {profile.surface_roughness}/10</span>
              </div>
            </div>

            {selectedTerrainId === profile.id && (
              <div className="mt-3 p-2 bg-muted rounded-md">
                <div className="flex justify-between text-xs">
                  <span>Terrain Factor: {profile.terrain_factor}</span>
                  <span>Elevation Factor: {profile.elevation_factor}</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}