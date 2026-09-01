import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Configuration, Component } from './configuratorStore'

export interface CartItem {
  id: string
  configuration: Configuration
  totalPrice: number
  totalWeight: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  
  // Actions
  addItem: (configuration: Configuration, components: Component[]) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      addItem: (configuration, components) => {
        const totalPrice = components.reduce((sum, c) => sum + c.base_price, 0)
        const totalWeight = components.reduce((sum, c) => sum + c.weight_kg, 0)
        
        set((state) => {
          const existingItem = state.items.find(
            (item) => JSON.stringify(item.configuration) === JSON.stringify(configuration)
          )
          
          if (existingItem) {
            const updatedItems = state.items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
            return {
              items: updatedItems,
              totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
              totalPrice: updatedItems.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0),
            }
          }
          
          const newItem: CartItem = {
            id: crypto.randomUUID(),
            configuration,
            totalPrice,
            totalWeight,
            quantity: 1,
          }
          
          const updatedItems = [...state.items, newItem]
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: updatedItems.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0),
          }
        })
      },

      removeItem: (id) => {
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id)
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: updatedItems.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0),
          }
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, i) => sum + i.quantity, 0),
            totalPrice: updatedItems.reduce((sum, i) => sum + i.totalPrice * i.quantity, 0),
          }
        })
      },

      clearCart: () => {
        set({ items: [], totalItems: 0, totalPrice: 0 })
      },

      getItemCount: () => {
        return get().totalItems
      },

      getTotalPrice: () => {
        return get().totalPrice
      },
    }),
    {
      name: 'himal-ride-cart',
    }
  )
)