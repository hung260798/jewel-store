import GridAndFilters from "@/components/Grid/GridAndFilters";
import { LazyFadeImage } from "@/components/Images";
import { API_URL, ASSET_URL } from "@/constants/URLS";
import { appendDomain, cn } from "@/utils/stringUtils";
import { Category, Product } from "@/utils/types";
import Head from "next/head";
import styles from "./index.module.css";
import { FilterCriteria } from "@/hooks/storeSlices/SliceTypes";

interface Props {
  filters: Parameters<typeof GridAndFilters>[0]["filters"];
  products: Product[];
  amountOfProducts: number;
  category?: Category;
  pageTitle: string;
  slots?: Record<string, React.ReactNode>;
  constCriteria?: Partial<FilterCriteria>;
}

export default function ProductsGrid({
  filters,
  products,
  amountOfProducts,
  category,
  pageTitle,
  slots = {},
  constCriteria,
}: Props) {
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      {/* Products Grid */}
      <div className={`${styles.productsSection}`}>
        <div
          className={cn(
            "mx-auto max-w-[1120px] w-full xl:w-[1120px] p-2 xl:p-0 mb-20",
            !!category && "mt-8"
          )}
        >
          {slots.hero}
          {category && (
            <LazyFadeImage
              domain={API_URL}
              src={appendDomain(category.coverImageUrl || "", ASSET_URL)}
              className="w-full mx-auto max-h-[20rem] object-cover aspect-[4/1]"
              rootClassName="w-full"
            />
          )}
          <GridAndFilters
            filters={filters}
            data={{ products: products, amountOfProducts: amountOfProducts }}
            constCriteria={constCriteria}
          />
        </div>
      </div>
    </>
  );
}
