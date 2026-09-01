import { Outlet, Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Bike,
  LogOut,
  Menu
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export function Layout() {
  const { user, logout } = useAuthStore()
  const itemCount = useCartStore((state) => state.getItemCount())
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-1.5 flex justify-end text-xs text-muted-foreground">
          <span>🇳🇵 Nepal's Premium Bike Builder</span>
        </div>
      </div>

      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                HIMAL-RIDE
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link to="/configurator">
                <Button variant="ghost" size="sm" className="font-medium">
                  Build
                </Button>
              </Link>
              
              {user && (
                <>
                  <Link to="/saved-builds">
                    <Button variant="ghost" size="sm" className="font-medium flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      Saved
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="font-medium flex items-center gap-1">
                      <User className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="font-medium text-primary">
                        Admin
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-5 h-5 text-xs bg-primary">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {!user ? (
                <Link to="/login">
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-1 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-2">HIMAL-RIDE</h4>
              <p className="text-sm text-muted-foreground">
                Nepal's premier custom bike builder. Built for the Himalayas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><Link to="/configurator" className="hover:text-foreground">Build a Bike</Link></li>
                <li><Link to="/explore" className="hover:text-foreground">Explore Bikes</Link></li>
                <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Support</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link to="/faq" className="hover:text-foreground">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <p className="text-sm text-muted-foreground">
                Follow us for the latest builds and updates.
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-lg">📷</span>
                <span className="text-lg">📘</span>
                <span className="text-lg">🐦</span>
              </div>
            </div>
          </div>
          <div className="border-t mt-6 pt-4 text-center text-sm text-muted-foreground">
            © 2026 HIMAL-RIDE. All rights reserved. 🇳🇵 Made in Nepal.
          </div>
        </div>
      </footer>
    </div>
  )
}