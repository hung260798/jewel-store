import router from "next/router";
import { create } from "zustand";
// import useAxiosAuth from "@/libraries/axiosAuth";
import { axiosClient } from "@/libraries/axiosConfig";
import {
  Product as BaseProduct,
  Active,
  WithId,
} from "@/utils/types/entityTypes";
import { devLog } from "@/utils/log";
type Product = WithId<BaseProduct> & Active & { amountSold: number };

interface ProdSearchSlice {
  searchResult: Product[];
  productSearch: (data: string) => void;
  searchCategory: (data: string) => void;
  searchKeyword: string;
}

export const useProdsSearch = create<ProdSearchSlice>()((set) => {
  return {
    searchResult: [],
    searchKeyword: "",
    productSearch: async (data: string) => {
      try {
        const search = await axiosClient.get(
          `/products?productName=${data}&isActive=true`
        );
        set({ searchResult: search.data?.results, searchKeyword: data });
      } catch {
        devLog("err");
      }
    },
    searchCategory: async (data: string) => {
      try {
        const search = await axiosClient.get<{ results: Product[] }>(
          `/products?categoryId=${data}&isActive=true&isDeleted=false`
        );
        router.push(`/tim-kiem`);
        const products = search.data?.results;
        if (products.length <= 0) {
          set({ searchResult: [] });
          return;
        }
        set({
          searchResult: products.filter((item) => item.isDeleted === false),
          searchKeyword: data,
        });
      } catch {
        devLog("err");
      }
    },
  };
});
