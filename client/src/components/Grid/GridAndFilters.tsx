import { ProductCard } from "@/components/Cards/Product";
import FilterDropdown, {
  NameAndId,
  Sorter,
} from "@/components/Dropdowns/Filter";
import NoProduct from "@/components/Placeholders/NoProduct";
import { ITEMS_PER_PAGE } from "@/constants";
import {
  useProductFilter,
  useProductFilterImmer,
} from "@/hooks/storeSlices/FilterProductSlice";
import { Product } from "@/utils/types";
import { FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import { useDebounce } from "@uidotdev/usehooks";
import { Button, Modal, Pagination, Select, Spin, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { FilterCriteria } from "@/hooks/storeSlices/SliceTypes";
import { useShallow } from "zustand/react/shallow";

type FilterProps = Parameters<typeof FilterDropdown>[0];

type GridAndFiltersProps = {
  filters: FilterProps[];
  data: { products: Product[]; amountOfProducts: number };
  constCriteria?: Partial<FilterCriteria>;
};

const predicate = (v: object): v is FilterProps & { options: NameAndId[] } =>
  "options" in v;

function FilterIndicators(props: { filters: FilterProps[] }) {
  const { filters } = props;
  const criteria = useProductFilterImmer((s) => s.filterCriteria);
  const categoryOptions =
    filters.filter(predicate).find((f) => f.fKey === "categoryId")?.options ||
    [];
  const supplierOptions =
    filters.filter(predicate).find((f) => f.fKey === "supplierId")?.options ||
    [];
  const filteringCategories = (criteria?.categoryId || [])
    .map((id) => categoryOptions.find((option) => option._id === id)?.name)
    .filter((s) => !!s);
  const filteringSuppliers = (criteria?.supplierId || [])
    .map((id) => supplierOptions.find((option) => option._id === id)?.name)
    .filter((s) => !!s);
  const tags = [...filteringCategories, ...filteringSuppliers];
  const maxDisplay = 4;

  return (
    <div className="hidden lg:flex gap-1 h-6">
      {tags.slice(0, maxDisplay).map((tag, index) => {
        return (
          <Tag
            color="cyan"
            key={`${tag}-${index}`}
            className="max-w-[20%] overflow-hidden text-ellipsis"
          >
            {tag}
          </Tag>
        );
      })}
      {maxDisplay < tags.length && (
        <Tag color="cyan">+{tags.length - maxDisplay}</Tag>
      )}
    </div>
  );
}

function FilterList(props: { filters: FilterProps[] }) {
  const { filters } = props;
  const eraseCriteria = useProductFilterImmer((s) => s.eraseCriteria);
  const setCriteria = useProductFilterImmer((s) => s.setCriteria);
  const [modalOpening, setModalOpening] = useState(false);

  if (!filters.length) {
    return null;
  }
  return (
    <div className="mb-4">
      {/* Filters mobile */}
      <Button
        className="w-full lg:hidden"
        size="large"
        onClick={() => setModalOpening(true)}
      >
        <FilterOutlined />
        <SortAscendingOutlined />
        Bộ lọc
      </Button>
      <Modal
        open={modalOpening}
        onOk={() => setModalOpening(false)}
        onCancel={() => setModalOpening(false)}
        afterClose={() => {
          if (modalOpening) setModalOpening(false);
        }}
        closable={true}
        cancelText="Huỷ"
      >
        <div className="overflow-auto max-h-[500px] my-5 mx-2 ">
          <div className={`flex flex-col gap-4 ${styles.modalInner}`}>
            {filters.map((filter) => {
              return (
                <FilterDropdown
                  key={filter.fKey}
                  {...filter}
                />
              );
            })}

            <div className="pl-0">
              <span className="font-semibold">Sắp xếp theo</span>
              <Select
                style={{ width: "100%" }}
                options={[
                  { value: "Sản phẩm mới nhất" },
                  { value: "Sản phẩm bán chạy nhất" },
                  { value: "Giá cao đến thấp" },
                  { value: "Giá thấp đến cao" },
                ]}
                defaultValue={"Sản phẩm mới nhất"}
                onSelect={(value) => {
                  switch (value) {
                    case "Sản phẩm mới nhất": {
                      setCriteria({
                        sortBy: "updatedDate",
                        sortOrder: "-1",
                      });
                      break;
                    }
                    case "Sản phẩm bán chạy nhất": {
                      setCriteria({
                        sortBy: "amountSold",
                        sortOrder: "-1",
                      });
                      break;
                    }
                    case "Giá cao đến thấp": {
                      setCriteria({
                        sortBy: "price",
                        sortOrder: "-1",
                      });
                      break;
                    }
                    case "Giá thấp đến cao": {
                      setCriteria({
                        sortBy: "price",
                        sortOrder: "1",
                      });
                      break;
                    }
                  }
                }}
              />
            </div>

            <Button
              type="link"
              onClick={() => {
                eraseCriteria();
              }}
              size="large"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </Modal>
      <div className="hidden lg:flex flex-row justify-between items-center">
        {/* Filters desktop */}
        <div className="py-4 ">
          <h5>Bộ lọc</h5>
          <div className="flex flex-wrap gap-1 items-center">
            {filters.map((filter, index) => {
              return (
                <FilterDropdown
                  key={index}
                  {...filter}
                />
              );
            })}
            <Button
              onClick={() => {
                eraseCriteria();
              }}
              type="link"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
        {/* Sorter */}
        <div className="mt-4 md:mt-0 ">
          <h5>Sắp xếp theo</h5>
          <Sorter />
        </div>
      </div>
      {/** Filtering tags */}
      <FilterIndicators {...props} />
    </div>
  );
}

export default function GridAndFilters({
  filters,
  data: { products: staticProducts, amountOfProducts: staticAmountOfProducts },
  constCriteria = {},
}: GridAndFiltersProps) {
  // console.log("GridAndFilter render");
  const filterResult = useProductFilterImmer((s) => s.filterResult);
  const amountFilterProduct = useProductFilterImmer((s) => s.amountResult);
  // const eraseCriteria = useProductFilterImmer((s) => s.eraseCriteria);
  // const setCriteria = useProductFilterImmer((s) => s.setCriteria);
  const filter = useProductFilterImmer((s) => s.filter);
  // const { filter } = useProductFilter();
  const loading = useProductFilterImmer((s) => s.loading);
  const products = filterResult ?? staticProducts;
  const topRef = useRef<HTMLDivElement>(null);
  const skip =
    useProductFilterImmer(useShallow((s) => s.filterCriteria?.skip)) || "0";
  const currentPage = Number(skip) / ITEMS_PER_PAGE + 1;
  const filterCriteria = useProductFilterImmer((s) => s.filterCriteria);
  const debounceCriteria = useDebounce(filterCriteria, 600);

  useEffect(() => {
    return () => {
      useProductFilterImmer.setState((state) => {
        state.filterResult = null;
        state.filterCriteria = null;
      });
    };
  }, []);

  useEffect(() => {
    // Scroll về đầu trang khi không ở đầu trang
    const handleScroll = () => {
      const rect = topRef.current?.getBoundingClientRect();
      if (!rect) return;
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
      if (!isVisible) {
        topRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };
    if (debounceCriteria != null) {
      filter(constCriteria);
      handleScroll();
    }
  }, [
    debounceCriteria?.categoryId?.join("-"),
    debounceCriteria?.supplierId?.join("-"),
    debounceCriteria?.priceRange?.[0],
    debounceCriteria?.priceRange?.[1],
    debounceCriteria?.skip,
    debounceCriteria?.limit,
  ]);

  let grid: React.ReactNode = <NoProduct />;
  if (products.length) {
    grid = (
      <>
        <div className="mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {products?.map((product) => {
            return (
              <ProductCard
                key={product._id}
                product={product}
                hoverTransform={false}
              />
            );
          })}
        </div>
        <Pagination
          align="center"
          defaultCurrent={1}
          current={currentPage}
          pageSize={ITEMS_PER_PAGE}
          onChange={(page, pageSize) => {
            const skipStr = (pageSize * (page - 1)).toString();
            const limitStr = pageSize.toString();
            useProductFilterImmer.setState((state) => {
              state.loading = true;
              state.filterCriteria = {
                ...state.filterCriteria,
                skip: skipStr,
                limit: limitStr,
                ...constCriteria,
              };
            });
          }}
          total={amountFilterProduct ?? staticAmountOfProducts}
          style={{ marginTop: "2rem" }}
          showSizeChanger={false}
        />
      </>
    );
  }

  return (
    <>
      <div
        id="grid-top"
        ref={topRef}
      ></div>
      <FilterList filters={filters} />
      <Spin spinning={loading}>{grid}</Spin>
    </>
  );
}
