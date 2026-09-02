import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  configuration: Record<string, unknown>
  quantity: number
  totalPrice: number
  totalWeight: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  
  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number  // ✅ Add this method
  getTotalPrice: () => number // ✅ Add this method
}

function computeTotals(items: CartItem[]) {
  return {
    totalItems: items.reduce((s, i) => s + i.quantity, 0),
    totalPrice: items.reduce((s, i) => s + i.totalPrice * i.quantity, 0),
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (item) =>
        set((state) => {
          const newItems = [
            ...state.items,
            { ...item, id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
          ]
          return { items: newItems, ...computeTotals(newItems) }
        }),

      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id)
          return { items: newItems, ...computeTotals(newItems) }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems =
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
          return { items: newItems, ...computeTotals(newItems) }
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),

      getItemCount: () => {
        return get().totalItems
      },

      getTotalPrice: () => {
        return get().totalPrice
      },
    }),
    { name: 'himal-cart' }
  )
)