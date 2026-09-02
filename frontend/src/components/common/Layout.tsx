import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mountain, ShoppingCart, User, Menu, X, ChevronDown, LayoutDashboard, Settings } from 'lucide-react'
import { Button } from '../ui/button'
import { useCartStore } from '../../stores/cartStore'
import { useAuthStore } from '../../stores/authStore'

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const totalItems = useCartStore((state) => state.totalItems)
  const location = useLocation()
  const navigate = useNavigate()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/configurator', label: 'Build' },
    { to: '/orders', label: 'Orders' },
  ]

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mountain className="w-4.5 h-4.5 text-white" />
            </div>
            <span>HIMAL<span className="text-primary">RIDE</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'text-primary bg-primary/8' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin') ? 'text-primary bg-primary/8' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}>
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setUserOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
                >
                  <div className="w-6 h-6 bg-primary/15 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                    {user.full_name?.[0] || 'U'}
                  </div>
                  {user.full_name?.split(' ')[0] || 'User'}
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-1.5 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50" onMouseLeave={() => setUserOpen(false)}>
                    <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setUserOpen(false)}>
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors" onClick={() => setUserOpen(false)}>
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => { logout(); setUserOpen(false); navigate('/') }}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors w-full text-left"
                    >
                      <User className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/register"><Button size="sm">Get Started</Button></Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors" onClick={() => setMenuOpen((v) => !v)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to) ? 'text-primary bg-primary/8' : 'text-muted-foreground hover:bg-muted'
              }`} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
            <hr className="border-border my-2" />
            {user ? (
              <>
                <Link to="/dashboard" className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); navigate('/') }} className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-muted">
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-1">
                <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  )
}