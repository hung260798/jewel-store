import { create } from "zustand";

type Updater<T> = (s: T) => T;
type SetState<T> = (s: T | Updater<T>) => void;

type State = {
  // ids: string[]; // danh sách các lớp overlay đang hiển thị trên màn hình.
  ids: string[];
  setIds: SetState<string[]>;
  globalLoading: boolean;
  setGlobalLoading: SetState<boolean>;
};

// quản lí các lớp overlay xuất hiện trên màn hình.
const useLayer = create<State>()((set) => {
  return {
    ids: [],
    setIds(ids) {
      if (typeof ids === "function") {
        return set((state) => {
          return {
            ids: ids(state.ids),
          };
        });
      } else {
        return set(() => {
          return {
            ids: ids,
          };
        });
      }
    },
    globalLoading: false,
    setGlobalLoading: (updater) => {
      if (typeof updater == "function") {
        set((state) => ({
          ...state,
          globalLoading: updater(state.globalLoading),
        }));
      } else {
        set((state) => ({ ...state, globalLoading: updater }));
      }
    },
  };
});

export default useLayer;
