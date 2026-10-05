type Id = string;

interface IdWise {
  _id: Id;
}

type WithId<T = object> = T & IdWise;

type WithTimeStamp<T> = T & TimeStamp;

type Concrete<T extends object> = {
  [k in keyof T]-?: T[k];
};

interface Active {
  active?: boolean;
  isDeleted?: boolean;
}

interface Category {
  name: string;
  imageUrl: string;
  coverImageUrl: string;
  note: string;
  description: string;
  slug: string;
}

interface Category2
  extends IdWise, Category, TimeStamp, Editor, Concrete<Active> {}

interface CartItem {
  product: Product & { productId?: string } & IdWise;
  quantity: number;
}

interface Supplier extends IdWise {
  name: string;
  email: string;
  phone: string;
  address: string;
  note: string;
}

// 4 ref
interface Product {
  name: string;
  price: number;
  stock: number;
  discount: number;
  note: string;
  imageUrl: string;
  images?: string[];
  category: WithId<Partial<Category>>;
  supplier: WithId<Partial<Supplier>>;
  description?: string;
  slug: string;
  averageRate: number;
}

interface Product {
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  amountSold?: number;
  image?: string;
  images?: string[];
  description?: string;
  rateInfo?: {
    _id: string;
    customer: Partial<Customer> & { comment: string };
    rateNumber: number;
    createdAt: string;
  }[];
  active?: boolean;
  isDeleted?: boolean;
}

interface User {
  firstName: string;
  lastName: string;
  birthday: Date;
  address: string;
  note: string;
  imageUrl: string;
}

interface Account {
  email: string;
  password: string;
  phoneNumber: string;
  isAdmin: boolean;
  Locked: boolean;
}

interface Customer extends User, Account {
  bio?: string;
  sex?: string;
}

interface TimeStamp {
  createdDate: Date | string;
  updatedDate: Date | string;
}

interface OrderLine {
  quantity: number;
  product: WithId<Product> & { total: number };
}

interface PersonName {
  firstName: string;
  lastName: string;
}

interface EmployeeName extends PersonName {
  employeeId: Id;
}

interface Editor {
  createdBy: EmployeeName;
  updatedBy: EmployeeName;
}

type OrderStatus = "WAITING" | "ECONFIRMED" | "COMPLETED" | "CANCELED";

interface PaymentMethod {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
}

// No ref
interface Order {
  _id: string;
  createdDate: string;
  shippedDate: string;
  description: string;
  shippingAddress: string;
  status: string;
  orderDetails: OrderDetail[];
  contactInformation: unknown;
  customerId: string;
  position?: unknown;
  paymentType: string;
  customer: Partial<Customer>;
  employee: Partial<User>;
}

interface OrderDetail {
  _id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  discount: number;
}

interface Collection extends Active {
  _id: Id;
  name: string;
  image: string;
  coverImage: string;
  products: WithId<Product>[];
}

interface Slide {
  imageUrl: string;
  title: string;
  summary: string;
  note: string;
  active: boolean;
  _id: string;
  url: string;
}

interface Message {
  sender: string;
  text: string;
  receiver: {
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
  createdAt: string;
}

interface Cart2 {
  _id: string;
  products: CartItem[];
}
/**
 * @alias {GetMany}
 */
interface GetList<T> {
  results: T[];
  amountResults: number;
}

type GetMany<T> = GetList<T>;

interface GetOne<T> {
  result: T;
}

interface NameAndId {
  name: string;
  _id: string;
}

export type {
  Id,
  WithId,
  WithTimeStamp,
  Active,
  Editor,
  Account,
  Category,
  Category2,
  Customer,
  Product,
  User,
  Supplier,
  TimeStamp,
  Order,
  OrderLine,
  OrderDetail,
  Collection,
  Slide,
  Message,
  Cart2 as Cart,
  GetList,
  GetMany,
  GetOne,
  OrderStatus,
  CartItem,
  PaymentMethod,
  NameAndId,
};
