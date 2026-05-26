import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthState } from "../types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      wrkRcpNo: null,
      setAuthenticated: (wrkRcpNo) =>
        set({ isAuthenticated: true, wrkRcpNo }),
      clear: () => set({ isAuthenticated: false, wrkRcpNo: null }),
    }),
    {
      name: "kakao-webview-auth",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
