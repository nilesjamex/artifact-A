import { createContextId } from "@builder.io/qwik";

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

export interface CartItems {
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartState {
  items: {
    value: CartItems;
  };
}

export const CartContext = createContextId<CartState>("cart.context");
