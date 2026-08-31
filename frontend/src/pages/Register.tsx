export function Register() {
  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Register</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="••••••••"
          />
        </div>
        <button className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md">
          Create Account
        </button>
      </form>
    </div>
  )
}