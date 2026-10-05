import { axiosClient } from "@/libraries/axiosConfig";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { CartStore } from "./SliceTypes";

export const useCartStore = create<CartStore>()(
  immer(
    persist(
      (set, get) => ({
        customerId: "",
        cartId: "",
        items: [],
        itemsCheckout: [],
        // Lấy data giỏ từ server
        getDataServer: async (cart, customerId) => {
          return set(
            (state) => ({
              ...state,
              items: cart?.products || [],
              customerId: customerId,
              cartId: cart?._id,
            }),
            false
          );
        },
        // Thêm sp mới vào giỏ
        add: async ({ product, quantity }) => {
          const cartId = get().cartId;
          set((state) => {
            const items = state.items;
            // Cái này có thể không cần xử lý vì bên button {add to cart} đều xử lý r
            const found = items?.find((x) => x?.product?._id === product?._id);
            if (found) {
              found.quantity += 1;
            } else {
              items.push({ product, quantity });
            }
          });
          await axiosClient.patch(`/carts/${cartId}`, {
            products: get().items,
          });
        },
        // Xoá sp ra khỏi giỏ
        remove: async (productId) => {
          const cartId = get().cartId;
          set((state) => {
            state.items = state.items.filter(
              (x) => x.product._id !== productId
            );
            state.itemsCheckout = state.itemsCheckout.filter(
              (x) => x.product._id !== productId
            );
          });
          await axiosClient.patch(`/carts/${cartId}`, {
            products: get().items,
          });
        },
        // Tăng số lượng sp trong giỏ
        increase: (productId) =>
          set((state) => {
            const cartId = state.cartId;
            const found = state.items.find(
              (item) => item.product._id === productId
            );
            if (found) found.quantity++;
            const found2 = state.itemsCheckout.find(
              (item) => item.product._id === productId
            );
            if (found2) found2.quantity++;
            axiosClient.patch(`/carts/${cartId}`, {
              products: state.items,
            });
          }),
        // Giảm số lượng sp trong giỏ
        decrease: (productId) =>
          set((state) => {
            const found = state.items.find((x) => x.product._id === productId);
            const foundCheckout = state.itemsCheckout.find(
              (x) => x.product._id === productId
            );
            if (found) {
              found.quantity--;
              state.items = state.items.filter((item) => item.quantity > 0);
              axiosClient.patch(`/carts/${state.cartId}`, {
                products: state.items,
              });
            }
            if (foundCheckout) foundCheckout.quantity--;
            state.itemsCheckout = state.itemsCheckout.filter(
              (item) => item.quantity > 0
            );
          }),
        // Thêm vào danh sách thanh toán
        addCheck: async (item) => {
          set((state) => {
            const foundIndex = state.itemsCheckout.findIndex(
              (element) => element.product._id === item.product._id
            );
            const found = state.itemsCheckout[foundIndex];
            if (!found) {
              state.itemsCheckout.push(item);
            } else {
              const newQty = found.quantity + item.quantity;
              if (newQty <= 0) {
                state.itemsCheckout.splice(foundIndex, 1);
              } else {
                state.itemsCheckout.splice(foundIndex, 1, {
                  ...found,
                  quantity: newQty,
                });
              }
            }
          });
        },
        // Xoá khỏi danh sách thanh toán
        removeCheck: async (item) => {
          const newItemsToCheckout = get().itemsCheckout.filter(
            (x) => x.product._id !== item.product._id
          );
          return set(
            (s) => ({ ...s, itemsCheckout: newItemsToCheckout }),
            false
          );
        },
        // Set danh sách sp thanh toán
        setItemsCheckout: (itemsCheckout) =>
          set((state) => {
            state.itemsCheckout = itemsCheckout;
          }),
        // Đưa tất cả sp trong giỏ vào ds thanh toán
        selectAllCheck: async () => {
          return set((s) => {
            s.itemsCheckout = s.items;
          });
        },
        // Đưa tất cả sp ra khỏi ds thanh toán
        removeAllCheck: async () => {
          return set((s) => {
            s.itemsCheckout = [];
          });
        },
      }),
      { name: "cart_slice", storage: createJSONStorage(() => localStorage) }
    )
  )
);
