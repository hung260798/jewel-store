import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export const useSaveOrderId = create(
  devtools(
    persist(
      (set: any, get: any) => ({
        orderId: "",
        saveOrderId: async (_id: any) => {
          return set(
            {
              orderId: _id,
            },
            false,
            {
              type: "order/saveOrderId",
            }
          );
        },
      }),
      {
        name: "orderId-storage", // unique name
        storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      }
    )
  )
);
