import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface BearState {
  bears: number
  name: string
  addBear: () => void
  removeBear: () => void
  updateName: (name: string) => void
  reset: () => void
}

const useStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        name: '',
        addBear: () => set((state) => ({ bears: state.bears + 1 })),
        removeBear: () => set((state) => ({ bears: Math.max(0, state.bears - 1) })),
        updateName: (name: string) => set(() => ({ name })),
        reset: () => set(() => ({ bears: 0, name: '' })),
      }),
      {
        name: 'bear-storage',
      }
    )
  )
)

export default useStore