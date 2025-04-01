import { create, StoreApi, UseBoundStore } from "zustand";

interface PremuimModalState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const usePremiumModal: UseBoundStore<StoreApi<PremuimModalState>> =
  create<PremuimModalState>((set) => ({
    open: false,
    setOpen: (open: boolean) => set({ open }),
  }));

export default usePremiumModal;
