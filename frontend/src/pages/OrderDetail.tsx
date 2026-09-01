import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiClient } from '../api/client'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { 
  ArrowLeft,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  CreditCard
} from 'lucide-react'

interface OrderDetail {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  delivery_fee: number
  total_amount: number
  created_at: string
  estimated_delivery_date: string
  delivery_address: {
    full_name: string
    phone: string
    street: string
    city: string
    district: string
    notes: string
  }
  configuration_snapshot: {
    items: Array<{
      id: string
      configuration: Record<string, any>
      quantity: number
      totalPrice: number
    }>
  }
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchOrderDetail()
    }
  }, [id])

  const fetchOrderDetail = async () => {
    try {
      const response = await apiClient.get(`/api/v1/orders/${id}`)
      setOrder(response.data)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
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
      case 'delivered': return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'cancelled': return <XCircle className="w-6 h-6 text-red-500" />
      case 'shipped': return <Truck className="w-6 h-6 text-purple-500" />
      case 'pending':
      case 'paid': return <Clock className="w-6 h-6 text-yellow-500" />
      default: return <Package className="w-6 h-6 text-muted-foreground" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground">Order not found</p>
        <Link to="/orders">
          <Button variant="outline" className="mt-3">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/orders">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Order {order.order_number}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(order.status)}
          {order.payment_status === 'completed' ? (
            <Badge variant="outline" className="border-green-500 text-green-500">
              Payment Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              Payment Pending
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Status */}
        <Card className="p-4 col-span-1">
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon(order.status)}
            <div>
              <p className="font-medium">Order Status</p>
              <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
            </div>
          </div>
          <Separator />
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium capitalize">{order.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Est. Delivery</span>
              <span className="font-medium">
                {order.estimated_delivery_date 
                  ? new Date(order.estimated_delivery_date).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </Card>

        {/* Delivery Address */}
        <Card className="p-4 col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <p className="font-medium">Delivery Address</p>
          </div>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{order.delivery_address.full_name}</p>
            <p className="text-muted-foreground">{order.delivery_address.phone}</p>
            <p className="text-muted-foreground">{order.delivery_address.street}</p>
            <p className="text-muted-foreground">
              {order.delivery_address.city}, {order.delivery_address.district}
            </p>
            {order.delivery_address.notes && (
              <p className="text-muted-foreground text-xs italic">
                Note: {order.delivery_address.notes}
              </p>
            )}
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-4 col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-muted-foreground" />
            <p className="font-medium">Order Summary</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Fee</span>
              <span>Rs. {order.delivery_fee.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>Rs. {order.total_amount.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Configuration Snapshot */}
      {order.configuration_snapshot && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">Build Configuration</h3>
          <div className="space-y-2">
            {order.configuration_snapshot.items?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">Build #{index + 1}</span>
                <span className="font-medium">Rs. {item.totalPrice.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}