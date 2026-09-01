import { Outlet, Link } from 'react-router-dom'
import { useCartStore } from '../../stores/cartStore'
import { ShoppingCart } from 'lucide-react'

export function Layout() {
  const itemCount = useCartStore((state) => state.getItemCount())
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              HIMAL-RIDE
            </Link>
            <nav className="flex items-center gap-6">
              <Link to="/configurator" className="text-sm hover:text-primary">
                Build
              </Link>
              <Link to="/cart" className="relative text-sm hover:text-primary">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2026 HIMAL-RIDE. All rights reserved.
        </div>
      </footer>
    </div>
  )
}