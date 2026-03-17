import { createContextId } from "@builder.io/qwik";

export interface ProductState {
  items: any;
}

export const ProductContext = createContextId<ProductState>("product.context");
