import DropdownButton from "@/components/Buttons/DropdownButton";
import { useProductFilterImmer } from "@/hooks/storeSlices/FilterProductSlice";
import { FilterCriteria } from "@/hooks/storeSlices/SliceTypes";
import useLayer from "@/hooks/ui/layer";
import { cn } from "@/utils/stringUtils";
import { NameAndId } from "@/utils/types/entityTypes";
import { InputNumber, Slider } from "antd";
import { ReactNode } from "react";
// import { devLog } from "@/utils/log";

type Props = {
  fKey: keyof FilterCriteria;
  title: string;
  position?: "left" | "right";
} & (
  | { options: NameAndId[] }
  | { min: number; max: number }
  | {
      sorters: {
        label: string;
        sortBy: string;
        sortOrder: FilterCriteria["sortOrder"];
      }[];
    }
);

const FilterDropdown = (props: Props) => {
  const { fKey, title, position = "left" } = props;
  const filterKey = fKey;
  const ids = useLayer((s) => s.ids);
  const setIds = useLayer((s) => s.setIds);
  const filterCriteria = useProductFilterImmer((s) => s.filterCriteria);
  const _setCriteria = useProductFilterImmer((s) => s.setCriteria);
  const setCriteria = (criteria: Partial<FilterCriteria>) => {
    _setCriteria((current) => {
      const mustResetPage = !!(
        criteria.categoryId ||
        criteria.supplierId ||
        criteria.priceRange
      );
      if (!current) {
        return { ...criteria, ...(mustResetPage ? { skip: "0" } : null) };
      }
      Object.entries(criteria).forEach(([k, v]) => {
        current[k] = v;
      });
      if (mustResetPage) {
        current.skip = "0";
      }
    });
  };
  const filterValue = filterCriteria?.[filterKey];
  const filteringBy = Object.entries(filterCriteria ?? {})
    .filter(([, v]) => {
      if (Array.isArray(v)) {
        return v.length > 0;
      }
      if (typeof v === "string") {
        return v !== "";
      }
      return v !== undefined;
    })
    .map(([k]) => k);

  let dropdownContent: ReactNode = null;
  if ("options" in props) {
    const { options } = props;
    const toggleCheck = (item: NameAndId) => () => {
      const newCriteria: typeof filterCriteria = { ...filterCriteria };
      if (Array.isArray(filterValue) || filterValue == null) {
        const idArray = (filterValue ?? []) as string[];
        let newIdArray: string[]; ///newIdArray là mảng category/supplier mới
        if (idArray.includes(item._id)) {
          newIdArray = idArray.filter((id) => id !== item._id);
        } else {
          newIdArray = [...idArray, item._id];
        }
        // return setLocal(newIdArray);
        newCriteria[filterKey] = newIdArray;
        return setCriteria(newCriteria);
      }
    };

    dropdownContent = (
      <ul
        className={`space-y-2 text-sm`}
        aria-labelledby="dropdownDefault"
      >
        {options.map((item) => {
          const isChecked = (filterValue ?? [])?.includes(item._id);
          return (
            <li
              className={`flex items-center transition-all duration-200 px-2 py-1.5`}
              key={item._id}
            >
              <label
                htmlFor={item.name}
                className={`ml-2 text-sm font-medium cursor-pointer select-none transition-colors duration-200 ${
                  isChecked
                    ? "text-blue-700 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                } inline-flex w-full items-center`}
              >
                <input
                  onChange={toggleCheck(item)}
                  id={item.name}
                  type="checkbox"
                  value={item._id}
                  checked={isChecked}
                  className={`w-5 h-5 me-5 rounded transition-all duration-200 bg-white border-gray-300 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer`}
                />
                {item.name}
              </label>
            </li>
          );
        })}
      </ul>
    );
  } else if ("min" in props) {
    const filterVal =
      filterKey !== "" ? (filterValue as [number, number]) : undefined;
    const { max, min } = props;
    const [from, to] = filterVal || [min, max];
    const name = title;
    // const fKey=key;
    dropdownContent = (
      <div className="space-y-4">
        <Slider
          range
          min={min}
          max={max}
          value={[from, to]}
          onChange={([newFrom, newTo]) => {
            const newCriteria: typeof filterCriteria = { ...filterCriteria };
            newCriteria[filterKey] =
              newFrom === min && newTo === max ? undefined : [newFrom, newTo];
            return setCriteria(newCriteria);
          }}
          step={500000}
          tooltip={{
            formatter: (value) => `${value?.toLocaleString()}₫`,
          }}
          className="range-slider"
        />
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700 mb-2">{name}</div>
          <div className="flex flex-col gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">Từ</label>
              <InputNumber
                value={from}
                onChange={(from) => {
                  const numberFrom = typeof from === "number" ? from : min;
                  const newCriteria: typeof filterCriteria = {
                    ...filterCriteria,
                  };
                  newCriteria[filterKey] =
                    numberFrom === min && to === max
                      ? undefined
                      : [numberFrom, to];
                  return setCriteria(newCriteria);
                }}
                step={500000}
                className="w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => parseInt(value?.replace(/[$,]/g, "") ?? "0")}
                suffix="₫"
                style={{ borderColor: "#e5e7eb" }}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-600 mb-1 block">Đến</label>
              <InputNumber
                value={to}
                onChange={(to) => {
                  const numberTo = typeof to === "number" ? to : max;
                  const newCriteria: typeof filterCriteria = {
                    ...filterCriteria,
                  };
                  newCriteria[filterKey] =
                    from === min && numberTo === max
                      ? undefined
                      : [from, numberTo];
                  return setCriteria(newCriteria);
                }}
                step={500000}
                className="w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => parseInt(value?.replace(/[$,]/g, "") ?? "0")}
                suffix="₫"
                style={{ borderColor: "#e5e7eb" }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if ("sorters" in props) {
    dropdownContent = (
      <ul
        className={`space-y-2 text-sm ml-0 pl-0`}
        aria-labelledby="dropdownDefault"
      >
        {props.sorters.map((item) => {
          return (
            <li
              className={`flex items-center transition-all duration-200 cursor-pointer hover:bg-blue-50 mx-0 px-0 py-2 `}
              key={item.label}
              onClick={() => {
                const newCriteria = {
                  ...filterCriteria,
                  sortBy: item.sortBy,
                  sortOrder: item.sortOrder,
                };
                setCriteria(newCriteria);
              }}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    );
  }

  const isActive = filteringBy?.includes(fKey);

  return (
    <>
      {/**Small screen  */}
      <div className={`lg:hidden`}>
        <div className={`flex items-center gap-2 px-0`}>
          {isActive && (
            <span
              className={`w-2 h-2 rounded-full bg-blue-500 animate-pulse`}
            ></span>
          )}
          <span
            className={`font-semibold text-sm ${isActive ? "text-blue-600" : "text-gray-700"}`}
          >
            {title}
          </span>
        </div>
        <div
          className={`pl-2 py-2 bg-gray-50 rounded-b-lg`}
          onClick={(e) => e.stopPropagation()}
        >
          {dropdownContent}
        </div>
      </div>

      {/**Large screen */}
      <div
        className={`hidden lg:flex items-center justify-center relative`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Dropdown menu */}
        <div
          className={cn(
            `z-10 min-w-[16rem] max-w-[22rem] w-fit p-4 absolute top-full left-0`,
            "transition-all duration-200 ease-in transform origin-top opacity-0 scale-y-95",
            "rounded-lg, shadow-lg border border-gray-100 dark:border-gray-700",
            "bg-white dark:bg-gray-800",
            position === "right" ? "right-0 left-auto" : "left-0",
            "h-0 overflow-clip",
            { "h-auto opacity-100 scale-y-100": ids.includes(fKey) }
            // ids.includes(fKey) && "h-auto opacity-100 scale-y-100",
          )}
        >
          {ids.includes(fKey) && dropdownContent}
        </div>
        <DropdownButton
          onClick={() => {
            if (!ids.includes(fKey)) {
              setIds(() => [fKey]);
            } else {
              setIds((prev) => prev.filter((id) => id !== fKey));
            }
          }}
          className={cn(
            isActive &&
              "bg-blue-50 border border-blue-300 text-blue-700 shadow-sm",
            ids.includes(fKey) && "ring-1 ring-blue-200",
            "hover:shadow-sm"
          )}
        >
          <span className="flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${isActive ? "bg-blue-500 animate-pulse" : "bg-none"}`}
            ></span>
            <span className="truncate">{title}</span>
          </span>
          <svg
            className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
              ids.includes(fKey) ? "rotate-180 text-blue-600" : "text-gray-500"
            }`}
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </DropdownButton>
      </div>
    </>
  );
};

function Sorter() {
  const sorters = [
    {
      value: "Sản phẩm mới nhất",
      label: "Sản phẩm mới nhất",
      sortBy: "updatedDate",
      sortOrder: "-1" as const,
    },
    {
      value: "Sản phẩm bán chạy nhất",
      label: "Sản phẩm bán chạy nhất",
      sortBy: "amountSold",
      sortOrder: "-1" as const,
    },
    {
      value: "Giá cao đến thấp",
      label: "Giá cao đến thấp",
      sortBy: "price",
      sortOrder: "-1" as const,
    },
    {
      value: "Giá thấp đến cao",
      label: "Giá thấp đến cao",
      sortBy: "price",
      sortOrder: "1" as const,
    },
  ];
  return (
    <FilterDropdown
      sorters={sorters}
      position="right"
      fKey="sorter"
      title="Sắp xếp"
    />
  );
}

export { FilterDropdown as default, Sorter, type NameAndId };
