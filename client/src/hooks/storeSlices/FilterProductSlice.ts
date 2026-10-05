import { ITEMS_PER_PAGE } from "@/constants";
import { axiosClient } from "@/libraries/axiosConfig";
import { devLog } from "@/utils/log";
import {
  Active,
  Product as BaseProduct,
  GetList,
  WithId,
} from "@/utils/types/entityTypes";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { FilterCriteria } from "./SliceTypes";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect } from "react";

type Product = WithId<BaseProduct> & Active & { amountSold: number };

export const defaultPriceRange: [number, number] = [0, 1000 * 1000 * 1000];

export const initialCriteria: SliceState["filterCriteria"] = {
  priceRange: undefined,
  categoryId: [],
  supplierId: [],
  sortBy: "_id",
  sortOrder: "1",
};

interface SliceState {
  filterCriteria: FilterCriteria | null;
  filterResult: Product[] | null;
  amountResult: number | null;
  loading: boolean;
}

interface SliceAction {
  setCriteria: (
    data:
      | SliceState["filterCriteria"]
      | ((d: SliceState["filterCriteria"]) => void)
  ) => void;
  eraseCriteria: () => void;
  /**
   * Call axios
   * @param criteria
   * @returns
   */
  filter: (criteria?: SliceState["filterCriteria"]) => void;
}

export const useProductFilterImmer = create<SliceState & SliceAction>()(
  immer((set, get) => ({
    filterCriteria: null,
    filterResult: null,
    amountResult: null,
    loading: false,
    setCriteria: async (data) => {
      if (typeof data === "function") {
        return set((state) => {
          if (!state.filterCriteria)
            state.filterCriteria = data(
              state.filterCriteria
            ) as unknown as FilterCriteria;
          else data(state.filterCriteria);
        });
      }
      const newCriteria = { ...get().filterCriteria, ...data };
      set((state) => {
        state.filterCriteria = newCriteria;
      });
    },
    eraseCriteria: async () => {
      set((state) => {
        state.filterCriteria = {
          ...initialCriteria,
          skip: state.filterCriteria?.skip,
          limit: state.filterCriteria?.limit,
        };
      });
    },
    filter: async (criteria) => {
      try {
        const finalCriteria = {
          ...initialCriteria,
          ...get().filterCriteria,
          ...criteria,
        };
        const {
          categoryId,
          supplierId,
          priceRange,
          sortBy,
          sortOrder,
          skip = 0,
          limit = ITEMS_PER_PAGE,
        } = finalCriteria;
        const searchParams = {
          active: true,
          isDeleted: false,
          categoryId,
          supplierId,
          sortBy,
          sortOrder,
          skip,
          limit,
          fromPrice: priceRange?.[0],
          toPrice: priceRange?.[1],
        };
        const finalParams = Object.fromEntries(
          Object.entries(searchParams).filter(
            ([, v]) => v !== undefined && v !== null && v !== ""
          )
        );
        // const critChanged = criteria && Object.keys(criteria).length > 0;
        set((state) => {
          state.loading = true;
          // if (critChanged) state.filterCriteria = finalCriteria;
        });
        try {
          const response = await axiosClient.get<GetList<Product>>(
            "/products",
            {
              params: finalParams,
            }
          );
          set((state) => {
            state.filterResult = response.data.results;
            state.amountResult = response.data.amountResults;
            state.loading = false;
          });
        } catch (error) {
          set((state) => {
            state.loading = false;
          });
          devLog("error when sending request", error);
        }
      } catch (error) {
        devLog("error when filter product", error);
      }
    },
  }))
);

// Trả về hàm filter để set filterResult theo filterCriteria state, result
// được cache bằng tasnstack query
export const useProductFilter = () => {
  const setState = useProductFilterImmer.setState;
  const filterCriteriaState = useProductFilterImmer(
    (state) => state.filterCriteria
  );
  const filterCriteriaDebounce = useDebounce(filterCriteriaState, 600);
  const queryParams = buildParam(filterCriteriaState || {});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => {
      return axiosClient.get("/products", { params: queryParams });
    },
  });

  useEffect(() => {
    setState((state) => {
      state.loading = isLoading;
    });
    if (!isLoading)
      setState((state) => {
        state.filterResult = data?.data.results || [];
        state.amountResult = data?.data.amountResults || 0;
        // state.error = error;
      });
  }, [isLoading]);

  const filter = () => {
    setState((state) => {
      state.filterResult = data?.data.results || [];
      state.amountResult = data?.data.amountResults || 0;
      // state.error = error;
    });
  };

  return { filter };
};

const buildParam: (
  criteria: FilterCriteria
) => Record<string, string | number | boolean | string[] | undefined> = (
  criteria
) => {
  const {
    categoryId,
    supplierId,
    priceRange,
    sortBy,
    sortOrder,
    skip = "0",
    limit = `${ITEMS_PER_PAGE}`,
  } = criteria;
  const searchParams = {
    active: true,
    isDeleted: false,
    categoryId,
    supplierId,
    sortBy,
    sortOrder,
    skip,
    limit,
    fromPrice: priceRange?.[0],
    toPrice: priceRange?.[1],
  };
  const finalParams = Object.fromEntries(
    Object.entries(searchParams).filter(([, v]) => v != null && v !== "")
  );
  return finalParams;
};
