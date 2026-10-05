import ProductsGrid from "@/components/PageSections/ProductsGrid";
import { useProdsSearch } from "@/hooks/storeSlices/PropsSearchSlice";
import { SearchOutlined } from "@ant-design/icons";

function SearchPage() {
  const { searchResult, searchKeyword } = useProdsSearch((state) => state);
  // const { add, items: itemsCart, increase } = useBoundStore((state) => state.cart);

  return (
    <ProductsGrid
      filters={[]}
      amountOfProducts={searchResult?.length || 0}
      products={searchResult}
      pageTitle="Tim kiem"
      slots={{
        hero: (
          <h3 className="flex justify-center items-center h-40 gap-2">
            <SearchOutlined /> Kết quả tìm kiếm cho:
            <strong>{searchKeyword}</strong>
          </h3>
        ),
      }}
    />
  );
}

export default SearchPage;
