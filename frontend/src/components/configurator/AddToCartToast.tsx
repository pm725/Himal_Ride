import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

export function showAddToCartToast(buildName: string) {
  toast.success(`"${buildName}" added to cart! 🛒`, {
    duration: 5000,
    action: {
      label: 'View Cart',
      onClick: () => window.location.href = '/cart',
    },
  })
}