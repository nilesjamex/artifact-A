import { createContextId } from "@builder.io/qwik";

export interface ProductState {
  items: any;
  searchQuery?: string;
}

export const ProductContext = createContextId<ProductState>("product.context");
