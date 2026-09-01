import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'
import { apiClient } from '../api/client'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Separator } from '../components/ui/separator'
import { Badge } from '../components/ui/badge'
import { AlertCircle, CheckCircle2, Truck, CreditCard, Wallet } from 'lucide-react'

interface DeliveryRegion {
  id: string
  name: string
  region_type: string
  base_fee: number
  estimated_days: number
  districts: string
  is_active: boolean
}

interface DeliveryAddress {
  full_name: string
  phone: string
  street: string
  city: string
  district: string
  notes: string
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()
  
  const [step, setStep] = useState(1) // 1: Address, 2: Delivery, 3: Payment, 4: Confirmation
  const [regions, setRegions] = useState<DeliveryRegion[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [address, setAddress] = useState<DeliveryAddress>({
    full_name: user?.full_name || '',
    phone: '',
    street: '',
    city: '',
    district: '',
    notes: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [orderResult, setOrderResult] = useState<any>(null)
  const [deliveryFee, setDeliveryFee] = useState(0)
  const [estimatedDays, setEstimatedDays] = useState(0)

  useEffect(() => {
    fetchDeliveryRegions()
  }, [])

  const fetchDeliveryRegions = async () => {
    try {
      const response = await apiClient.get('/api/v1/delivery/regions')
      setRegions(response.data)
    } catch (error) {
      console.error('Failed to fetch delivery regions:', error)
    }
  }

  const handleRegionSelect = (regionId: string) => {
    const region = regions.find(r => r.id === regionId)
    if (region) {
      setSelectedRegion(regionId)
      setDeliveryFee(region.base_fee)
      setEstimatedDays(region.estimated_days)
    }
  }

  const handleCreateOrder = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setIsLoading(true)
    try {
      // Prepare order data
      const orderData = {
        delivery_region_id: selectedRegion,
        delivery_address: address,
        payment_method: paymentMethod,
        configuration_snapshot: {
          items: items.map(item => ({
            id: item.id,
            configuration: item.configuration,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          })),
        },
        subtotal: totalPrice,
        delivery_fee: deliveryFee,
        total_amount: totalPrice + deliveryFee,
      }

      const response = await apiClient.post('/api/v1/orders', orderData)
      setOrderResult(response.data)
      
      // Simulate payment
      await apiClient.post(`/api/v1/orders/${response.data.id}/payment`)
      
      setStep(4) // Confirmation
      clearCart()
    } catch (error) {
      console.error('Order failed:', error)
      alert('Order creation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const paymentMethods = [
    { id: 'esewa', name: 'eSewa', icon: '📱' },
    { id: 'khalti', name: 'Khalti', icon: '📱' },
    { id: 'fonepay', name: 'Fonepay', icon: '📱' },
    { id: 'cod', name: 'Cash on Delivery', icon: '💵' },
  ]

  // Step 4: Confirmation
  if (step === 4 && orderResult) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Confirmed! 🎉</h1>
        <p className="text-muted-foreground mb-2">
          Your order has been placed successfully.
        </p>
        <p className="text-lg font-semibold mb-6">
          Order Number: <span className="font-mono">{orderResult.order_number}</span>
        </p>
        <Card className="p-6 text-left mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Amount</p>
              <p className="font-semibold">Rs. {orderResult.total_amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Method</p>
              <p className="font-semibold capitalize">{orderResult.payment_method}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Delivery</p>
              <p className="font-semibold">
                Estimated {estimatedDays} day{estimatedDays > 1 ? 's' : ''}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="success">Paid</Badge>
            </div>
          </div>
        </Card>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/')}>Continue Shopping</Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            View Orders
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8 text-sm">
        {['Address', 'Delivery', 'Payment'].map((label, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step > index + 1 ? 'bg-primary text-primary-foreground' :
              step === index + 1 ? 'border-2 border-primary text-primary' :
              'bg-muted text-muted-foreground'
            }`}>
              {step > index + 1 ? '✓' : index + 1}
            </div>
            <span className={step === index + 1 ? 'font-medium' : 'text-muted-foreground'}>
              {label}
            </span>
            {index < 2 && <span className="text-muted-foreground">→</span>}
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* Step 1: Address */}
        {step === 1 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={address.full_name}
                  onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="98XXXXXXXX"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Street Address</Label>
                <Input
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="House number, street name"
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  placeholder="Kathmandu"
                />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Input
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  placeholder="Kathmandu"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Delivery Notes (Optional)</Label>
                <Input
                  value={address.notes}
                  onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                  placeholder="Landmark, gate code, etc."
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!address.full_name || !address.phone || !address.street || !address.city}
              >
                Continue to Delivery
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Delivery Region */}
        {step === 2 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Select Delivery Region</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regions.map((region) => (
                <Card
                  key={region.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedRegion === region.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleRegionSelect(region.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{region.name}</h4>
                      <p className="text-sm text-muted-foreground">{region.region_type}</p>
                      <p className="text-sm mt-1">{region.districts}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Rs. {region.base_fee}</p>
                      <p className="text-xs text-muted-foreground">{region.estimated_days} day{region.estimated_days > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!selectedRegion}
              >
                Continue to Payment
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            
            {/* Order Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>Rs. {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs. {(totalPrice + deliveryFee).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    paymentMethod === method.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                  </div>
                </Card>
              ))}
            </div>

            {paymentMethod === 'cod' && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Cash on Delivery available. Please keep the exact amount ready.
                </p>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button
                onClick={handleCreateOrder}
                disabled={!paymentMethod || isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}