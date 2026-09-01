import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Bike, 
  Mountain, 
  Gauge, 
  Shield, 
  Star,
  ArrowRight,
  TrendingUp,
  Truck,
  Users,
  Sparkles
} from 'lucide-react'

export function Landing() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white p-12 md:p-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-2xl">
          <Badge className="bg-white/10 text-white border-0 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Nepal's Premium Bike Builder
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Build Your
            <span className="text-primary block">Dream Bike</span>
          </h1>
          <p className="text-lg text-white/70 mb-8 max-w-lg">
            Customize your perfect mountain or electric bicycle for Nepal's diverse terrain. 
            From Kathmandu streets to Mustang trails.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/configurator">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Building
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Explore Bikes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Why HIMAL-RIDE?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mountain className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Nepal-Terrain Optimized</h3>
            <p className="text-muted-foreground text-sm">
              Profiles for Kathmandu, Nagarkot, and Mustang
            </p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gauge className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Real-Time Simulation</h3>
            <p className="text-muted-foreground text-sm">
              See range, torque, and compatibility instantly
            </p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Premium Components</h3>
            <p className="text-muted-foreground text-sm">
              Curated parts for Himalayan conditions
            </p>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted p-8 rounded-2xl">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">50+</p>
          <p className="text-sm text-muted-foreground">Components</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">3</p>
          <p className="text-sm text-muted-foreground">Terrain Profiles</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">4</p>
          <p className="text-sm text-muted-foreground">Payment Methods</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">100%</p>
          <p className="text-sm text-muted-foreground">Nepal-Made</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-3">Ready to Build Your Dream Bike?</h2>
        <p className="text-muted-foreground mb-6">
          Start customizing now and experience the thrill of riding your perfect bike.
        </p>
        <Link to="/configurator">
          <Button size="lg">
            Build Now
            <Bike className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  )
}