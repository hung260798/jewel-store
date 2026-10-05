import * as yup from "yup";

const OrderStatus = ["WAITING", "ECONFIRMED", "COMPLETED", "CANCELED"];

const PaymentTypes = ["CASH", "CREDIT CARD", "MOMO", "VNPAY"];

const phoneRegex =
  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;

const PhoneStr = yup.string().matches(phoneRegex, "Phone number is not valid");

const IdStr = yup.string();
//   .test("Validate ObjectID", "${path} is not valid ObjectID", (value) => {
//     if (!value) {
//       return true;
//     }
//     return ObjectId.isValid(value);
//   });

const orderItemSchema = yup.object({
  productId: IdStr.required(),
  quantity: yup.number().integer().min(1).required(),
});

const defaultOrderPart = {
  paymentType: yup.string().oneOf(PaymentTypes).default("CASH"),
  status: yup.string().oneOf(OrderStatus).default("WAITING"),
};

const StrRequire = yup.string().required();

const orderSchema = yup.object({
  description: yup.string(),
  shippingAddress: StrRequire,
  ...defaultOrderPart,
  customerId: StrRequire,
  employeeId: yup.string(),
  orderDetails: yup.array().of(orderItemSchema).min(1).required(),
  contactInformation: yup
    .object({
      address: yup.string(),
      firstName: StrRequire,
      lastName: StrRequire,
      phoneNumber: PhoneStr,
    })
    .required(),
  position: yup.object({
    lat: yup.string(),
    lng: yup.string(),
    name: yup.string(),
  }),
  note: yup.string(),
});

const addOrderRequest = yup.object({
  body: orderSchema,
});

const simpleEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strictEmailPattern =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export {
  orderSchema,
  addOrderRequest,
  phoneRegex,
  simpleEmailPattern,
  strictEmailPattern,
};
