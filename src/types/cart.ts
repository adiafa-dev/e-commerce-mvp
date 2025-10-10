// ====== PRODUCT TYPE ======
export type ApiProduct = {
  id: number;
  title: string;
  price: number;
  image?: string;
};

// ====== ITEM DI CART ======
export type ApiCartItem = {
  id: number; // ✅ ID cart item di backend
  quantity: number;
  product: ApiProduct;
};

// ====== SHOP DI CART ======
export type ApiShop = {
  id: number;
  name: string;
  logo?: string | null; // ✅ bisa null juga
  items: ApiCartItem[];
};

// ====== RESPONSE DARI API /cart ======
export type ApiCartResponse = {
  success: boolean;
  message?: string;
  data?: {
    cartId: number;
    items: {
      id: number;
      productId: number;
      qty: number;
      priceSnapshot: number;
      subtotal: number;
      product: {
        id: number;
        title: string;
        price: number;
        images?: string[];
        shop: {
          id: number;
          name: string;
          slug: string;
        };
      };
    }[];
  };
};

// ====== FRONTEND VERSION (flattened cart item) ======
export type CartItem = {
  cartItemId: number;
  productId: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  shop: {
    id: number;
    name: string;
    logo?: string;
  };
};
