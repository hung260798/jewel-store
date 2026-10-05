import ProductsGrid from "@/components/PageSections/ProductsGrid";
import ErrorComponent from "@/components/Placeholders/Errors";
import { ITEMS_PER_PAGE } from "@/constants";
import { axiosClient } from "@/libraries/axiosConfig";
import { devLog, printError } from "@/utils/log";
import { Category, Product } from "@/utils/types";
import { Supplier } from "@/utils/types/entityTypes";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

export default function CategoryPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { category, products, suppliers, amountOfProducts, error } = props;
  // const eraseCriteria = useProductFilterImmer((s) => s.eraseCriteria);
  // const setCriteria = useProductFilterImmer((s) => s.setCriteria);

  // useEffect(() => {
  //   if (category) {
  //     setCriteria({ categoryId: [category._id] });
  //   }
  //   return () => {
  //     eraseCriteria();
  //   };
  // }, [category]);

  if (error || !category) {
    return (
      <div className="flex justify-center items-center min-h-[20rem]">
        <ErrorComponent statusCode={500} />
      </div>
    );
  }

  const filters = [
    { fKey: "supplierId", title: "Thương hiệu", options: suppliers },
    { fKey: "priceRange", title: "Khoảng giá", min: 0, max: 10 ** 9 },
    {
      fKey: "gender",
      title: "Giới tính",
      options: [
        { name: "Nam", _id: "male" },
        { name: "Nữ", _id: "female" },
      ],
    },
  ];

  return (
    <ProductsGrid
      filters={filters}
      amountOfProducts={amountOfProducts}
      products={products}
      pageTitle={`${category.name} | Jewelry Shop`}
      category={category}
      constCriteria={{ categoryId: [category._id] }}
    />
  );
}

export const getStaticProps = (async ({ params }) => {
  try {
    const slug = params?.category;
    const {
      data: { result: category },
    } = await axiosClient.get<{ result: Category }>(`/categories?slug=${slug}`);

    const {
      data: { results: topProducts, amountResults: amountOfProducts },
    } = await axiosClient.get<{
      results: Product[];
      amountResults: number;
    }>(
      `/products?categoryId[]=${category._id}&isDeleted=false&active=true&limit=${ITEMS_PER_PAGE}&skip=0`
    );

    const {
      data: { results: suppliers },
    } = await axiosClient.get<{ results: Supplier[] }>(
      "/suppliers?active=true&isDeleted=false"
    );

    return {
      props: {
        category: category,
        products: topProducts,
        amountOfProducts,
        suppliers,
        error: null,
      },
    };
  } catch (error: unknown) {
    devLog(error);
    const errorMessage = printError(error);
    return {
      props: {
        category: null,
        products: [],
        suppliers: [],
        amountOfProducts: 0,
        error: errorMessage,
      },
    };
  }
}) satisfies GetStaticProps<{
  category: Category | null;
  products: Product[];
  amountOfProducts: number;
  suppliers: Supplier[];
  error: string | null;
}>;

export const getStaticPaths = (async () => {
  try {
    const results = await axiosClient.get<{ results: Category[] }>(
      `/categories?active=true&isDeleted=false`
    );
    const categories = results.data.results;
    const paths = categories.map((item) => ({
      params: { category: item.slug },
    }));
    return { fallback: false, paths };
  } catch (error) {
    devLog(error);
    return { fallback: false, paths: [] };
  }
}) satisfies GetStaticPaths;

// This also gets called at build time

// function slugify(text: string) {
//   return text
//     .toString() // Ensure the input is treated as a string
//     .normalize("NFD") // Decompose accented characters into base letter + diacritic
//     .replace(/[\u0300-\u036f]/g, "") // Remove diacritics (accents)
//     .toLowerCase() // Convert to lowercase
//     .trim() // Remove leading/trailing whitespace
//     .replace(/\s+/g, "-") // Replace spaces with hyphens
//     .replace(/[^\w-]+/g, "") // Remove all non-word characters (except hyphens)
//     .replace(/--+/g, "-"); // Replace multiple hyphens with a single hyphen
// }
