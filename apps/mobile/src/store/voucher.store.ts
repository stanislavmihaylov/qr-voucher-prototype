import { create } from 'zustand'

interface VoucherState {
  selectedVoucherId: string | null
  setSelectedVoucherId: (id: string | null) => void
}

export const useVoucherStore = create<VoucherState>((set) => ({
  selectedVoucherId: null,
  setSelectedVoucherId: (id) => set({ selectedVoucherId: id }),
}))
