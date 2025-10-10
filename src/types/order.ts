// ====== API RESPONSE TYPES ======

export type ApiShop = {
  id: number;
  name: string;
  logo: string;
};

export type ApiProduct = {
  id: number;
  title: string;
  price: number;
  images?: string[];
  shop?: {
    id: number;
    name: string;
    slug: string;
    logo?: string;
  };
};

export type ApiOrderItem = {
  id: number;
  productId: number;
  shopId: number;
  qty: number;
  priceSnapshot: number;
  status: string;
  product: ApiProduct;
  shop: ApiShop;
};

export type ApiOrder = {
  id: number;
  code: string;
  paymentStatus: string;
  address: string;
  totalAmount: number;
  createdAt: string;
  items: ApiOrderItem[];
};

export type ApiOrderResponse = {
  success: boolean;
  message: string;
  data: {
    orders: ApiOrder[];
  };
};

// ====== FRONTEND MAPPED TYPES ======

export type OrderItem = {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
  status: string;
};

export type Order = {
  id: number;
  invoice: string;
  paymentStatus: string;
  shop: {
    id: number;
    name: string;
    logo?: string;
  };
  total: number;
  createdAt: string;
  items: OrderItem[];
  status: string;
};
