import { Avatar, Badge, Dropdown, Grid, Space, Spin, message } from "antd";
import Image from "next/image";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import diamondImage from "./transparent-jewelry-icon-diamond-icon-60251ec5ca3757.4392206316130454458283.png";
// import { useCartStore } from "@/hooks/useCartStore";
import { ASSET_URL } from "@/constants/URLS";
import {
  HeartOutlined,
  LoadingOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import router, { SingletonRouter } from "next/router";
// import { usePropsSearch } from "@/hooks/PropsSearchSlice";
import { useCartStore } from "@/hooks/storeSlices/CartSlice";
import { useProdsSearch } from "@/hooks/storeSlices/PropsSearchSlice";
import useLayer from "@/hooks/ui/layer";
import { axiosClient } from "@/libraries/axiosConfig";
import { devLog } from "@/utils/log";
import { appendDomain, cn } from "@/utils/stringUtils";
import { Category, Customer, GetMany, WithId } from "@/utils/types/entityTypes";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ItemType } from "antd/es/menu/interface";
import { signOut, useSession } from "next-auth/react";
import style from "./style.module.css";
import { Product } from "@/utils/types";
import { useDebounce } from "@uidotdev/usehooks";
import NextImage from "next/image";
import { useProductFilterImmer } from "@/hooks/storeSlices/FilterProductSlice";

type CategoryAndId = WithId<Category & { children?: CategoryAndId[] }>;

type CartItemsDropdownProps = {
  noOfCartItemShow: number;
};

type DropdownMenu = Exclude<Parameters<typeof Dropdown>[0]["menu"], undefined>;

type Items = DropdownMenu["items"];

const menuLinks = [
  ["Trang chủ", "/"],
  ["Sản phẩm", "/san-pham"],
  ["Thương hiệu", "/thuong-hieu"],
  ["Liên hệ", "/lien-he"],
];

const queryClient = new QueryClient();

function QueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function CategoriesDropdown({
  showDropdown,
  setShowDropdown,
}: {
  showDropdown: boolean;
  setShowDropdown: (state: boolean) => void;
}) {
  const {
    data: categories,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["get_categories"],
    queryFn: () =>
      axiosClient
        .get<GetMany<CategoryAndId>>(`/categories?active=true&isDeleted=false`)
        .then((response) => response.data)
        .then((data) => data.results),
  });
  const [itemHovering, setItemHovering] = useState<CategoryAndId | undefined>(
    categories?.[0]
  );

  useEffect(() => {
    if (!itemHovering && categories && categories.length > 0) {
      setItemHovering(categories[0]);
    }
  }, [categories, itemHovering]);

  let content: ReactNode = null;
  if (isLoading) {
    content = (
      <div className="min-w-[320px] max-w-[90vw] min-h-[300px] flex items-center justify-center">
        <Spin />
      </div>
    );
  } else if (error) {
    content = (
      <div className="min-w-[320px] max-w-[90vw] min-h-[300px] flex items-center justify-center">
        error
      </div>
    );
  } else {
    content = (
      <div>
        <div className="flex">
          <div className="border-r border-gray-300">
            <ul className="max-h-[300px] overflow-y-auto overflow-x-hidden">
              {categories?.map((item, index) => {
                return (
                  <li
                    key={item?._id ?? index}
                    className={
                      "p-2 px-4 max-w-[15rem] cursor-pointer rounded transition-colors duration-200 hover:bg-gray-50 hover:text-blue-700 " +
                      `${style.transition}`
                    }
                    onMouseEnter={() => {
                      if (item) {
                        setItemHovering(item);
                      }
                    }}
                  >
                    <Link
                      href={`/${item?.slug}`}
                      onClick={() => {
                        setShowDropdown(false);
                        useProductFilterImmer.setState((state) => {
                          state.filterResult = null;
                          state.filterCriteria = null;
                        });
                      }}
                      className="w-full h-full inline-block"
                    >
                      {item?.name ?? "Category..."}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="min-w-[320px] max-w-[90vw] p-4">
            {Array.isArray(itemHovering?.children) && itemHovering?.children ? (
              <ul className="flex flex-wrap gap-5">
                {itemHovering.children.map((item, index) => {
                  return (
                    <li
                      key={item?._id ?? index}
                      className="mb-4 min-w-[160px]"
                    >
                      <Link
                        href={"#"}
                        className="font-semibold text-[1.25rem] hover:text-blue-700 transition-colors duration-200"
                      >
                        {item?.name || "Category"}
                      </Link>
                      {Array.isArray(item?.children) &&
                        item?.children.length > 0 && (
                          <ul className="mt-2 space-y-1 text-sm text-gray-600">
                            {item.children.map((child, childIndex) => {
                              return (
                                <li key={child?._id ?? childIndex}>
                                  <Link
                                    href={"#"}
                                    className="block rounded px-1 py-0.5 hover:bg-gray-100 hover:text-blue-700 transition-colors duration-200"
                                  >
                                    {child?.name || "Lvl3 category"}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-6 text-sm text-gray-500">
                Chọn danh mục để xem chi tiết.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`p-3 absolute z-10 top-[100%] left-0 hidden lg:block lg:min-w-[600px] lg:max-w-[90vw] shadow-lg bg-white rounded-md border ${
        showDropdown
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      } transition-all overflow-y-auto`}
    >
      {content}
    </div>
  );
}

function CartItemsDropdown(props: CartItemsDropdownProps) {
  const { noOfCartItemShow } = props;
  const { data: session } = useSession();
  const user = session?.user;
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.sm;
  const itemsCart = useCartStore((state) => state.items);
  const dropdownMenuItems: ItemType[] = user
    ? [
        ...itemsCart.slice(0, noOfCartItemShow).map((item, index: number) => ({
          key: index.toString(),
          label: (
            <Link href={`/san-pham/${item.product.slug}`}>
              <div className="ml-3 md:py-2 md:flex justify-between w-[70vw] md:w-[50vw] max-w-[600px]">
                <div className="md:basis-1/2 py-2 truncate">
                  {item.product?.name}
                </div>
                <div className="py-2">
                  {item.product?.price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </div>
              </div>
            </Link>
          ),
          icon: (
            <Badge
              color="blue"
              count={item.quantity}
            >
              <Avatar
                shape="square"
                size="large"
                src={appendDomain(item.product.imageUrl || "", ASSET_URL)}
                onClick={() => {
                  router.push(`/san-pham/${item.product.slug}`);
                }}
              />
            </Badge>
          ),
        })),
        {
          key: "view-cart",
          label: (
            <div
              className="md:py-2 text-center text-blue-600 font-semibold"
              onClick={() => {
                router.push(`/gio-hang`);
              }}
            >
              Xem tất cả
            </div>
          ),
        },
      ]
    : [
        {
          key: "no_user",
          label: <div>Vui lòng đăng nhập để thêm vào giỏ hàng !!!</div>,
        },
      ];

  const renderCustomDropdown = (menu: ReactNode) => {
    if (isMobile) {
      return (
        <div className={`${style["mobile-dropdown-overlay"]}`}>{menu}</div>
      );
    }
    return menu;
  };

  return (
    <CustomDropdown
      overlayStyle={{ zIndex: 10 }}
      menu={{
        items: dropdownMenuItems,
      }}
      popupRender={renderCustomDropdown}
      trigger={["click"]}
      placement="bottomRight"
      overlayClassName={isMobile ? style["mobile-dropdown-container"] : ""}
      Icon={ShoppingCartOutlined}
      badgeProps={{
        count: user ? itemsCart?.length : 0,
        className: "select-none",
      }}
    />
  );
}

/**
 * Search Bar Sub-component
 */
function SearchBar({
  productSearch,
  router,
  timeoutSearch,
  onSearchSuccess,
  isMobile = false,
}: {
  productSearch: (val: string) => void;
  router: SingletonRouter;
  timeoutSearch: React.MutableRefObject<NodeJS.Timeout | undefined>;
  onSearchSuccess?: () => void;
  isMobile?: boolean;
}) {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);
  const { data, isLoading: isSearching } = useQuery({
    queryKey: ["search-products", debouncedKeyword.trim()],
    queryFn: async function () {
      const kwTrim = debouncedKeyword.trim();
      if (!kwTrim) {
        return { results: [], amountResults: 0 };
      }
      const response = await axiosClient.get<GetMany<Product>>(`/products`, {
        params: {
          name: kwTrim,
          productName: kwTrim,
          skip: "0",
          limit: "10",
        },
      });
      return response.data;
    },
  });
  const [showing, setShowing] = useState(false);

  const { results = [] } = data || {};

  useEffect(() => {
    if (debouncedKeyword.trim() === keyword.trim() && keyword.trim() !== "") {
      setShowing(true);
    } else {
      setShowing(false);
    }
  }, [debouncedKeyword, keyword]);

  useEffect(() => {
    const clickHandler = () => {
      setShowing(false);
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  const handleSearch = async () => {
    if (!keyword) {
      message.error("Vui lòng nhập tên sản phẩm!!");
      return;
    }

    if (timeoutSearch.current) {
      clearTimeout(timeoutSearch.current);
    }

    await productSearch(keyword);
    router.push(`/tim-kiem`);

    if (isMobile) {
      setKeyword("");
      onSearchSuccess?.();
    } else {
      timeoutSearch.current = setTimeout(() => {
        setKeyword("");
      }, 2000);
    }
  };

  return (
    <div className={cn("relative md:ml-2")}>
      <div className="relative">
        <input
          value={keyword}
          type="text"
          className={cn(
            "block w-full p-2 pl-4 pr-12 text-sm text-gray-900 border border-gray-300 rounded-lg outline-1 outline-blue-300 transition-all duration-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white",
            isMobile ? " bg-gray-50" : "bg-transparent focus-within:bg-gray-50"
          )}
          placeholder="Nhập sản phẩm ..."
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          className={cn(
            "absolute inset-y-0 right-0 flex items-center justify-center transition duration-150 ease-in-out can-hover:hover:bg-black can-hover:hover:bg-opacity-5 can-hover:hover:text-blue-500 focus:outline-none bg-blue-500 text-white rounded-e-lg",
            isMobile
              ? " px-2 py-2 text-xs"
              : " border-primary px-3 py-2 text-sm font-medium uppercase"
          )}
          type="button"
          onClick={handleSearch}
          aria-label="Search"
        >
          <SearchOutlined style={isMobile ? { fontSize: "1.2rem" } : {}} />
        </button>
      </div>
      <div
        className={cn(
          "absolute mt-2 bg-white rounded-md border border-blue-500 w-full py-2 px-3 hidden sm:block sm:z-10 min-h-10 max-h-64",
          showing ? "visible" : "invisible",
          "overflow-auto"
        )}
      >
        {/* <h3 className="cursor-wait">Kết quả tìm kiếm</h3> */}
        <div className="text-center">
          {isSearching ? (
            <LoadingOutlined />
          ) : !results.length && keyword.trim() === debouncedKeyword.trim() ? (
            "Không tìm thấy"
          ) : (
            ""
          )}
        </div>

        <ul>
          {results.slice(0, 4).map((product) => (
            <li
              key={`result-${product._id}`}
              className="can-hover:hover:bg-gray-200 can-hover:hover:text-blue-600 rounded-md cursor-pointer p-0 can-hover:transition-colors"
            >
              <Link
                href={`/san-pham/${product.slug}`}
                className={cn(
                  "inline-block md:flex md:justify-between md:items-center",
                  "px-2 py-4",
                  "cursor-pointer"
                )}
              >
                <div className="flex gap-3">
                  <div className="max-w-[90px] max-h-[90px] overflow-clip">
                    <NextImage
                      src={product.imageUrl}
                      width={90}
                      height={90}
                      loading="lazy"
                      alt={`Ảnh của ${product.name}`}
                      className="aspect-square object-cover text-xs"
                      placeholder="empty"
                    />
                  </div>
                  <div>
                    <h3 className="line-clamp-1">{product.name}</h3>
                    <h5 className="font-semibold text-lg">{product.price}</h5>
                  </div>
                </div>
                <HeartOutlined />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Menu Toggle Button Sub-component
 */
function MenuToggle() {
  const timeoutSearch = useRef<NodeJS.Timeout>();
  const productSearch = useProdsSearch((state) => state.productSearch);
  return (
    <CustomDropdown
      Icon={MenuOutlined}
      badgeProps={{}}
      placement="bottomRight"
      trigger={["click"]}
      menu={{
        items: [
          {
            key: "search-bar",
            label: (
              <div
                className="-mx-4 -my-2 py-2 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <SearchBar
                  productSearch={productSearch}
                  router={router}
                  timeoutSearch={timeoutSearch}
                  isMobile
                  // onSearchSuccess={() => setOpenNavbar(false)}
                />
              </div>
            ),
            className: "sm:hidden",
          },
          ...menuLinks.map(([label, path]) => ({
            key: `link: ${path}`,
            label: (
              <li key={`link: ${path}`}>
                <button
                  type="button"
                  onClick={() => {
                    // setOpenNavbar(false);
                    router.push(path);
                  }}
                  onMouseEnter={() => {
                    // setShowDropdown(path === "/san-pham");
                  }}
                  className={cn(
                    "block py-2 px-4 w-full text-start text-gray-900 rounded hover:bg-gray-100     dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700",
                    "lg:text-center lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 lg:dark:hover:text-blue-500  lg:dark:hover:bg-transparent"
                  )}
                >
                  {label}
                </button>
              </li>
            ),
          })),
        ],
      }}
      popupRender={(menu) => (
        <div className={`${style["mobile-dropdown-overlay"]}`}>{menu}</div>
      )}
      overlayClassName={cn(
        style["mobile-dropdown-container"],
        style.dropdownContainer
      )}
      className="lg:hidden"
    />
  );
}

/**
 * Account Button Sub-component
 */
function AccountButton({
  user,
  itemsAccount,
  itemsAccountOut,
}: {
  user: Partial<Customer> | undefined;
  itemsAccount: Items;
  itemsAccountOut: Items;
}) {
  return (
    <CustomDropdown
      overlayStyle={{ zIndex: 10 }}
      trigger={["click"]}
      menu={{ items: user ? itemsAccount : itemsAccountOut }}
      placement="bottomRight"
      badgeProps={{}}
      Icon={UserOutlined}
    />
  );
}

function CustomDropdown(
  props: {
    Icon: typeof UserOutlined;
    badgeProps: Parameters<typeof Badge>[0];
  } & Parameters<typeof Dropdown>[0]
) {
  const { Icon, badgeProps, ...dropdownProps } = props;
  const finalDropdownProps = Object.fromEntries(
    Object.entries(dropdownProps).filter(([, v]) => v !== undefined)
  );
  return (
    <Dropdown
      overlayStyle={{ zIndex: 10 }}
      trigger={["click"]}
      {...finalDropdownProps}
    >
      <Badge {...badgeProps}>
        <div className="border border-gray-300 rounded-md lg:rounded-lg p-[4px] can-hover:hover:bg-slate-100 can-hover:cursor-pointer">
          <Icon
            className="lg:transition duration-300 ease-in-out lg:hover:scale-110"
            style={{
              fontSize: 28,
              color: "gray",
            }}
          />
        </div>
      </Badge>
    </Dropdown>
  );
}

const Navbar = () => {
  const timeoutSearch = useRef<NodeJS.Timeout>();
  const navbarRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const removeAllCheck = useCartStore((state) => state.removeAllCheck);
  const setGlobalLoading = useLayer((state) => state.setGlobalLoading);
  const { data: session } = useSession();
  const user = session?.user;
  const productSearch = useProdsSearch((state) => state.productSearch);
  const noOfCartItemShow = 5;

  return (
    <>
      {/* <div className="w-full"> */}
      <nav
        ref={navbarRef}
        className="w-full bg-white border-gray-200 dark:bg-gray-900 py-2 mb-0"
      >
        <div className="relative w-full xl:w-[1120px] flex flex-wrap items-center mx-auto p-1">
          {/** Page Logo */}
          <div className="text-center justify-center mr-4">
            <Link
              href="/"
              className="items-center"
            >
              <Image
                width={40}
                src={diamondImage}
                alt={"Diamond"}
              />
            </Link>
          </div>

          {/** Right side: Search (desktop), Menu Toggle Button(mobile), Cart, Account */}
          <div className="flex order-2 lg:order-3 grow items-center justify-end gap-x-3">
            {/** Search bar for large screen */}
            <div className="relative hidden basis-[300px] sm:block grow">
              <SearchBar
                productSearch={productSearch}
                router={router}
                timeoutSearch={timeoutSearch}
              />
            </div>

            {/** Menu toggle button (mobile) */}
            <MenuToggle />

            {/** Cart button */}
            <CartItemsDropdown noOfCartItemShow={noOfCartItemShow} />

            {/** Account button */}
            <AccountButton
              user={user}
              itemsAccount={[
                {
                  key: "information",
                  label: (
                    <div
                      className="p-2"
                      onClick={() => {
                        router.push("/tai-khoan");
                      }}
                    >
                      <Space>
                        <UserOutlined />
                        <span>Tài khoản</span>
                      </Space>
                    </div>
                  ),
                  style: { padding: 0 },
                },
                {
                  style: { padding: 0 },
                  key: "logout",
                  label: (
                    <div
                      className="p-2"
                      onClick={async () => {
                        setGlobalLoading(true);
                        try {
                          await signOut({ redirect: false });
                        } catch (error) {
                          devLog(error);
                        }
                        router.push("/dang-nhap");
                        removeAllCheck();
                        setTimeout(() => {
                          setGlobalLoading(false);
                        }, 1000);
                      }}
                    >
                      <Space>
                        <LogoutOutlined />
                        <span>Đăng xuất</span>
                      </Space>
                    </div>
                  ),
                },
              ]}
              itemsAccountOut={[
                {
                  key: "login",
                  label: (
                    <div
                      onClick={() => {
                        router.push("/dang-nhap");
                      }}
                    >
                      <Space>
                        <UserOutlined />
                        <span>Đăng nhập</span>
                      </Space>
                    </div>
                  ),
                },
                {
                  key: "register",
                  label: (
                    <div
                      onClick={() => {
                        router.push("/dang-ky");
                      }}
                    >
                      <Space>
                        <LogoutOutlined />
                        <span>Đăng ký</span>
                      </Space>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          {/** Spacer/Padding block for layout consistency */}
          <div className="h-5 order-1 lg:block lg:order-2"></div>

          {/** Mobile Menu - Desktop Navigation Links/Menu */}
          <div
            className={cn(
              "order-3 w-full absolute lg:static top-full left-0 z-20 bg-white shadow-lg lg:shadow-none rounded-b-lg lg:h-10 lg:flex lg:items-center lg:justify-between lg:w-auto lg:order-1",
              "transition-all ease-in-out duration-300 lg:transition-none",
              "opacity-0 pointer-events-none lg:pointer-events-auto lg:opacity-100"
            )}
          >
            {/** Main Navigation menu links */}
            <div
              className="relative"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <ul
                className={cn(
                  "lg:h-10 lg:flex lg:flex-row items-center p-1 mt-1 lg:p-0 lg:mt-0 lg:space-x-8 font-medium border border-t-0 border-gray-100 lg:border-0 dark:border-gray-700 bg-white lg:bg-white dark:bg-gray-800 lg:dark:border-gray-900 rounded-lg",
                  "hidden lg:flex"
                )}
              >
                {menuLinks.map(([label, path]) => (
                  <li key={`link: ${path}`}>
                    <button
                      type="button"
                      onClick={() => {
                        router.push(path);
                      }}
                      onMouseEnter={() => {
                        setShowDropdown(path === "/san-pham");
                      }}
                      className={cn(
                        "block py-2 px-4 w-full text-start text-gray-900 rounded hover:bg-gray-100     dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700",
                        "lg:text-center lg:hover:bg-transparent lg:hover:text-blue-700 lg:p-0 lg:dark:hover:text-blue-500  lg:dark:hover:bg-transparent"
                      )}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
              <CategoriesDropdown
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
              />
            </div>
          </div>
        </div>
      </nav>
      {/* </div> */}
    </>
  );
};

const NavbarWithClient = () => {
  return (
    // <QueryProvider>
    <Navbar />
    // </QueryProvider>
  );
};

export default NavbarWithClient;
