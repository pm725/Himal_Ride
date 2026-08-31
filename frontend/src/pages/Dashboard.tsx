export function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your HIMAL-RIDE dashboard.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Saved Builds</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Orders</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Wishlist</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  )
}