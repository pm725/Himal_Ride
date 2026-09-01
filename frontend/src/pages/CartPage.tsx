import { Link } from 'react-router-dom'
import { useCartStore } from '../stores/cartStore'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

export function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Start building your custom bike to add it to the cart.
        </p>
        <Link to="/configurator">
          <Button>Start Building</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-semibold">Custom Bike Build</h3>
                <p className="text-sm text-muted-foreground">
                  {item.totalWeight.toFixed(1)} kg · {item.totalPrice.toLocaleString()} NPR
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {Object.values(item.configuration)
                    .filter((val) => val !== null && typeof val === 'object' && 'name' in val)
                    .map((comp: any) => (
                      <span key={comp.id} className="text-xs px-2 py-0.5 bg-muted rounded">
                        {comp.name}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Total Items: <span className="font-medium">{totalItems}</span>
          </p>
          <p className="text-2xl font-bold">
            Total: Rs. {totalPrice.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/configurator">
            <Button variant="outline">Continue Building</Button>
          </Link>
          <Link to="/checkout">
            <Button size="lg">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}