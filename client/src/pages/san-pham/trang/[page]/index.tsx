import ProductsGrid from "@/components/PageSections/ProductsGrid";
import ErrorComponent from "@/components/Placeholders/Errors";
import { ITEMS_PER_PAGE } from "@/constants";
import { axiosClient } from "@/libraries/axiosConfig";
import { devLog, printError } from "@/utils/log";
import { Category, Product, Supplier } from "@/utils/types";
import { GetList } from "@/utils/types/entityTypes";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const ProductsPage = ({
  data,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (error) {
    return <ErrorComponent statusCode={500} />;
  }

  const { products, categories, suppliers, amountOfProducts } = data;

  const filters = [
    { fKey: "categoryId", title: "Danh mục", options: categories },
    { fKey: "supplierId", title: "Thương hiệu", options: suppliers },
    { fKey: "priceRange", title: "Khoảng giá", min: 100_000, max: 10 ** 8 },
    { fKey: "supplierId", title: "Giới tính", options: suppliers },
  ];

  return (
    <ProductsGrid
      filters={filters}
      amountOfProducts={amountOfProducts}
      products={products}
      pageTitle={`San pham | Jewelry Shop`}
    />
  );
};

export const getStaticPaths = (async () => {
  try {
    const pages = new Array(20).fill(1);
    const paths = pages.map((_, index) => ({
      params: { page: String(index + 1) },
    }));
    return { paths, fallback: false };
  } catch (error) {
    devLog(error);
    return { paths: [], fallback: false };
  }
}) satisfies GetStaticPaths;

interface Props {
  data: {
    products: Product[];
    categories: Category[];
    suppliers: Supplier[];
    amountOfProducts: number;
  };
  error: unknown;
}

// This also gets called at build time
export const getStaticProps = (async ({ params }) => {
  try {
    const { page: strPage = "1" } = params || {};
    const page = Number(strPage);
    const results = await Promise.all([
      axiosClient.get<GetList<Category>>("/categories?active=true"),
      axiosClient.get<GetList<Supplier>>("/suppliers?active=true"),
      axiosClient.get<GetList<Product>>(`/products`, {
        params: {
          active: "true",
          isDeleted: "false",
          skip: String(ITEMS_PER_PAGE * (page - 1)),
          limit: String(ITEMS_PER_PAGE),
          sortBy: "createdDate",
          sortOrder: "-1",
        },
      }),
    ]);
    return {
      props: {
        data: {
          categories: results[0].data.results,
          suppliers: results[1].data.results,
          products: results[2].data.results,
          amountOfProducts: results[2].data.amountResults,
        },
        error: null,
      },
      revalidate: 60 * 60,
    };
  } catch (error) {
    devLog(error);
    return {
      props: {
        data: {
          products: [],
          categories: [],
          suppliers: [],
          amountOfProducts: 0,
        },
        error: printError(error),
      },
      revalidate: 60 * 60,
    };
  }
}) satisfies GetStaticProps<Props>;

export default ProductsPage;
