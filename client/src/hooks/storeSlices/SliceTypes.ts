import { Product } from "@/utils/types";
import { Cart, CartItem } from "@/utils/types/entityTypes";

export interface FilterCriteria {
  categoryId?: string[];
  supplierId?: string[];
  priceRange?: [number, number];
  sortBy?: string;
  sortOrder?: "1" | "-1";
  skip?: string;
  limit?: string;
  [k: string]: any;
}

export interface CartState {
  customerId: string;
  cartId: string;
  items: CartItem[];
  itemsCheckout: CartItem[];
}

export interface CartActions {
  getDataServer: (cart: Cart, customerId: Id) => Promise<void>;
  add: (arg: { product: Product; quantity: number }) => Promise<void>;
  remove: (id: Id) => void;
  increase: (id: Id) => void;
  decrease: (id: Id) => void;
  addCheck: (item: CartItem) => void;
  removeCheck: (item: CartItem) => void;
  selectAllCheck: () => void;
  removeAllCheck: () => void;
  setItemsCheckout: (items: CartItem[]) => void;
}

export interface OrderSlice {
  orderId: string;
  saveOrderId: (_id: Id) => void;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface AuthSlice {
  auth: {
    token: string;
    refreshToken: string;
    payload: any;
    userId: string;
  } | null;
  login: (info: LoginInfo) => void;
  nextLogin: (info: LoginInfo) => void;
  dataFromToken: (token: string) => void;
  logout: () => void;
}

export interface PropsSearchSlice {
  dataSearch: unknown[];
  productSearch: (data: unknown) => void;
  searchCategory: (data: unknown) => void;
}

export type CartStore = CartState & CartActions;

export type Id = string;
