import * as Types from "@/utils/types/entityTypes";

type WithId<T> = Types.WithId<T>;

type WithActive<T> = Types.Active & T;

type FullOptions<T> = WithActive<WithId<T>>;

type Product = FullOptions<Types.Product>;

type Category = FullOptions<Types.Category>;

type Supplier = FullOptions<Types.Supplier>;

type User = FullOptions<Types.User>;

type Cart = WithId<Types.Cart>;

export type { Product, Category, Supplier, User, Cart };
