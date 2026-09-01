import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiClient } from '../api/client'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { 
  Search, 
  Package, 
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Truck
} from 'lucide-react'

interface Order {
  id: string
  order_number: string
  status: string
  payment_status: string
  total_amount: number
  created_at: string
  estimated_delivery_date: string
  delivery_address: {
    full_name: string
    city: string
    district: string
  }
}

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredOrders(
        orders.filter(o => 
          o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.delivery_address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredOrders(orders)
    }
  }, [searchTerm, orders])

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get('/api/v1/orders')
      setOrders(response.data.orders || [])
      setFilteredOrders(response.data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
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
      case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />
      case 'shipped': return <Truck className="w-5 h-5 text-purple-500" />
      case 'pending':
      case 'paid': return <Clock className="w-5 h-5 text-yellow-500" />
      default: return <Package className="w-5 h-5 text-muted-foreground" />
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Order History</h1>
          <p className="text-muted-foreground">View all your past orders</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-64"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">
            {searchTerm ? 'No orders match your search' : 'No orders found'}
          </p>
          <Link to="/configurator">
            <Button variant="outline" className="mt-3">Start Building</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {order.delivery_address && (
                        <p className="text-sm text-muted-foreground">
                          {order.delivery_address.city}, {order.delivery_address.district}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        Rs. {order.total_amount.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 justify-end">
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
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}