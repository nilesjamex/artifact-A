import { createContextId } from "@builder.io/qwik";

// export interface CartItem {
//   id: number;
//   product: Array<any>;
//   total: number;
//   discountedTotal: number;
//   userId: number;
//   totalProducts: number;
//   totalProducts: number;
// }

export interface CartState {
  items: any;
}

export const CartContext = createContextId<CartState>("cart.context");
