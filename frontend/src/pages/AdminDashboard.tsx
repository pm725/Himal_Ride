import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react'

interface AdminStats {
  total_orders: number
  total_revenue: number
  total_users: number
  total_components: number
  recent_orders: Array<{
    id: string
    order_number: string
    total_amount: number
    status: string
    created_at: string
  }>
  popular_components: Array<{
    id: string
    name: string
    count: number
  }>
  low_stock: Array<{
    id: string
    name: string
    inventory_count: number
  }>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      // In a real app, this would be a dedicated admin endpoint
      const response = await apiClient.get('/api/v1/admin/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
      // Fallback with mock data
      setStats({
        total_orders: 0,
        total_revenue: 0,
        total_users: 0,
        total_components: 0,
        recent_orders: [],
        popular_components: [],
        low_stock: []
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.total_orders || 0}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                Rs. {(stats?.total_revenue || 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.total_users || 0}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.total_components || 0}</p>
              <p className="text-sm text-muted-foreground">Components</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {stats?.recent_orders?.length === 0 ? (
          <Card className="p-4 text-center text-muted-foreground">No orders yet</Card>
        ) : (
          <div className="space-y-2">
            {stats?.recent_orders?.slice(0, 5).map((order) => (
              <Card key={order.id} className="p-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    Rs. {order.total_amount.toLocaleString()}
                  </span>
                  <Badge className={
                    order.status === 'delivered' ? 'bg-green-500' :
                    order.status === 'cancelled' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }>
                    {order.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Popular Components & Low Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Components</h2>
          {stats?.popular_components?.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">No data yet</Card>
          ) : (
            <div className="space-y-2">
              {stats?.popular_components?.slice(0, 5).map((comp) => (
                <Card key={comp.id} className="p-3 flex justify-between items-center">
                  <span>{comp.name}</span>
                  <Badge variant="secondary">{comp.count} builds</Badge>
                </Card>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Low Stock Alert</h2>
          {stats?.low_stock?.length === 0 ? (
            <Card className="p-4 text-center text-muted-foreground">All stock levels are good</Card>
          ) : (
            <div className="space-y-2">
              {stats?.low_stock?.map((comp) => (
                <Card key={comp.id} className="p-3 flex justify-between items-center border-red-300">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>{comp.name}</span>
                  </div>
                  <Badge variant="destructive">Only {comp.inventory_count} left</Badge>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/admin/products">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Package className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">Manage Products</p>
          </Card>
        </Link>
        <Link to="/admin/orders">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">Manage Orders</p>
          </Card>
        </Link>
        <Link to="/admin/components">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">Components</p>
          </Card>
        </Link>
        <Link to="/admin/inventory">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">Inventory</p>
          </Card>
        </Link>
      </div>
    </div>
  )
}

// Import Link at top
import { Link } from 'react-router-dom'