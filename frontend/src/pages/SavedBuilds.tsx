import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../api/client'
import { useAuthStore } from '../stores/authStore'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { 
  Heart, 
  Trash2, 
  Edit, 
  ShoppingCart,
  Calendar,
  Loader2,
  Plus
} from 'lucide-react'

interface SavedBuild {
  id: string
  name: string
  description: string
  components: Record<string, any>
  total_price: number
  total_weight: number
  estimated_range: number
  created_at: string
  is_in_cart: boolean
}

export function SavedBuilds() {
  const [builds, setBuilds] = useState<SavedBuild[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      fetchBuilds()
    }
  }, [user])

  const fetchBuilds = async () => {
    try {
      const response = await apiClient.get('/api/v1/configurations')
      setBuilds(response.data)
    } catch (error) {
      console.error('Failed to fetch saved builds:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this build?')) return
    try {
      await apiClient.delete(`/api/v1/configurations/${id}`)
      setBuilds(builds.filter(b => b.id !== id))
    } catch (error) {
      console.error('Failed to delete build:', error)
    }
  }

  const handleAddToCart = async (build: SavedBuild) => {
    // This would trigger the configurator to load this build
    // For now, we'll just show a message
    alert(`Build "${build.name}" added to cart!`)
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Please login to view saved builds</p>
        <Link to="/login">
          <Button className="mt-3">Login</Button>
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Saved Builds</h1>
          <p className="text-muted-foreground">Your custom bike configurations</p>
        </div>
        <Link to="/configurator">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Build
          </Button>
        </Link>
      </div>

      {builds.length === 0 ? (
        <Card className="p-8 text-center">
          <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No saved builds yet</p>
          <Link to="/configurator">
            <Button variant="outline" className="mt-3">Create Your First Build</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {builds.map((build) => (
            <Card key={build.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{build.name}</h3>
                  {build.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {build.description}
                    </p>
                  )}
                </div>
                {build.is_in_cart && (
                  <Badge variant="secondary">In Cart</Badge>
                )}
              </div>

              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">Rs. {build.total_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span>{build.total_weight.toFixed(1)} kg</span>
                </div>
                {build.estimated_range && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Range</span>
                    <span>{build.estimated_range.toFixed(1)} km</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saved</span>
                  <span className="text-xs">
                    {new Date(build.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleAddToCart(build)}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
                <Link to={`/configurator?load=${build.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(build.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}