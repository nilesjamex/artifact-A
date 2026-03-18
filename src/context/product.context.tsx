import { createContextId } from "@builder.io/qwik";

export interface ProductState {
  items: any;
  /** Current search query applied to products */
  searchQuery?: string;
}

export const ProductContext = createContextId<ProductState>("product.context");
