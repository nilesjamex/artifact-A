import {
  component$,
  Slot,
  useSignal,
  useContextProvider,
  useStore,
  useTask$,
} from "@builder.io/qwik";
import { Footer } from "~/components/Footer/Footer";
import { Nav } from "~/components/Nav/Nav";
import { Cart } from "~/components/Cart";
import { CartContext, CartState } from "~/context/cart.context";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ProductContext, ProductState } from "~/context/product.context";

export const useGetCart = routeLoader$(async () => {
  const res = fetch(`https://dummyjson.com/carts/10`, {
    headers: { Accept: "application/json" },
  });
  return (await res).json() as any;
});

export const useGetProducts = routeLoader$(async () => {
  const res = await fetch("https://dummyjson.com/products?limit=600", {
    headers: { Accept: "application/json" },
  });
  return (await res.json()) as any;
});

export default component$(() => {
  const cart = useStore<CartState>({ items: useGetCart() });
  const productResults = useGetProducts();
  const productList = useStore<ProductState>({
    items: { products: [] },
  });

  useTask$(({ track }) => {
    track(() => productResults.value);
    if (productResults.value) {
      productList.items = productResults.value;
    }
  });

  useContextProvider(CartContext, cart);
  useContextProvider(ProductContext, productList);
  const openCart = useSignal(false);
  const searchInput = useSignal("");

  useTask$(async ({ track }) => {
    track(() => searchInput.value);
    const res = await fetch(
      `https://dummyjson.com/products/search?q=${searchInput.value}&limit=600`,
      {
        headers: { Accept: "application/json" },
      },
    );
    const products = await res.json();
    productList.items = products;
    return;
  });

  return (
    <>
      {/* {openCart.value && <Cart openCart={openCart} />} */}
      <Cart openCart={openCart} />
      <Nav openCart={openCart} searchInput={searchInput} />
      <div class="layout__container">
        <Slot />
      </div>
      <Footer />
    </>
  );
});
