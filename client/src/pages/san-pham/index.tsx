import ProductsGrid from "@/components/PageSections/ProductsGrid";
import ErrorComponent from "@/components/Placeholders/Errors";
import { ITEMS_PER_PAGE } from "@/constants";
import { axiosClient } from "@/libraries/axiosConfig";
import { printError } from "@/utils/log";
import {
  Active,
  Category2 as Category,
  GetList,
  Product as Pro,
  Supplier,
  WithId,
} from "@/utils/types/entityTypes";
import { GetStaticProps, InferGetStaticPropsType } from "next";

interface Props {
  data: {
    products: Product[];
    categories: Category[];
    suppliers: Supplier[];
    amountOfProducts: number;
  };
  error: unknown;
}

type Product = WithId<Pro> & Active & { amountSold: number };

const ProductsPage = ({
  data,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  if (error) {
    return <ErrorComponent statusCode={500} />;
  }

  const { products, categories, suppliers, amountOfProducts } = data;

  return (
    <ProductsGrid
      filters={[
        { fKey: "categoryId", title: "Danh mục", options: categories },
        { fKey: "supplierId", title: "Thương hiệu", options: suppliers },
        { fKey: "priceRange", title: "Khoảng giá", min: 100_000, max: 10 ** 8 },
        {
          fKey: "gender",
          title: "Giới tính",
          options: [
            { name: "Nam", _id: "male" },
            { name: "Nữ", _id: "female" },
          ],
        },
      ]}
      amountOfProducts={amountOfProducts}
      products={products}
      pageTitle={`San pham | Jewelry Shop`}
    />
  );
};

export const getStaticProps = (async () => {
  // Call an external API endpoint to get posts
  // const response = await axiosClient.get(`/products?active=true`);
  try {
    const options = await Promise.all([
      axiosClient.get<GetList<Category>>("/categories?active=true"),
      axiosClient.get<GetList<Supplier>>("/suppliers?active=true"),
      axiosClient.get<GetList<Product>>(
        `/products?active=true&isDeleted=false&skip=0&limit=${ITEMS_PER_PAGE}`
      ),
    ]);
    return {
      props: {
        data: {
          categories: options[0].data.results,
          suppliers: options[1].data.results,
          products: options[2].data.results,
          amountOfProducts: options[2].data.amountResults,
        },
        error: null,
      },
      revalidate: 60 * 60,
    };
  } catch (e) {
    return {
      props: {
        data: {
          products: [],
          categories: [],
          suppliers: [],
          amountOfProducts: 0,
        },
        error: printError(e),
      },
      revalidate: 60 * 60,
    };
  }
}) satisfies GetStaticProps<Props>;

export default ProductsPage;
