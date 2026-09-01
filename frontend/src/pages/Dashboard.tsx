import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { apiClient } from '../api/client'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Separator } from '../components/ui/separator'
import { 
  User, 
  Package, 
  ShoppingBag, 
  Heart, 
  Settings, 
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total_amount: number
  created_at: string
  estimated_delivery_date: string
}

interface UserStats {
  total_orders: number
  total_builds: number
  member_since: string
}

export function Dashboard() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        apiClient.get('/api/v1/orders'),
        apiClient.get('/api/v1/users/me/stats')
      ])
      setOrders(ordersRes.data.orders || [])
      setStats(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: 'Pending', className: 'bg-yellow-500' },
      paid: { label: 'Paid', className: 'bg-blue-500' },
      shipped: { label: 'Shipped', className: 'bg-purple-500' },
      delivered: { label: 'Delivered', className: 'bg-green-500' },
      cancelled: { label: 'Cancelled', className: 'bg-red-500' },
    }
    const variant = variants[status] || variants.pending
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <AlertCircle className="w-4 h-4 text-blue-500" />
    }
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
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.full_name}!</h1>
          <p className="text-muted-foreground">Manage your account, orders, and builds</p>
        </div>
        <Link to="/configurator">
          <Button>Build New Bike</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.total_orders || 0}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Heart className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.total_builds || 0}</p>
              <p className="text-sm text-muted-foreground">Saved Builds</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Truck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'delivered').length}
              </p>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'pending' || o.status === 'paid').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Orders</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/orders">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <ShoppingBag className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">Order History</p>
          </Card>
        </Link>
        <Link to="/profile">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <User className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">Profile</p>
          </Card>
        </Link>
        <Link to="/saved-builds">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Heart className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">Saved Builds</p>
          </Card>
        </Link>
        <Link to="/configurator">
          <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
            <Settings className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
            <p className="font-medium">New Build</p>
          </Card>
        </Link>
      </div>

      {/* Recent Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
            <Link to="/configurator">
              <Button variant="outline" className="mt-3">Start Building</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <Link key={order.id} to={`/orders/${order.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold">
                        Rs. {order.total_amount.toLocaleString()}
                      </span>
                      {getStatusBadge(order.status)}
                      {order.payment_status === 'completed' ? (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          Pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}