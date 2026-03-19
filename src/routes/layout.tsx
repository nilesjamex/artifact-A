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
import { CartContext, CartState, CartItems } from "~/context/cart.context";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ProductContext, ProductState } from "~/context/product.context";
import { isBrowser } from "@builder.io/qwik/build";

const CART_STORAGE_KEY = "sf_cart";

const emptyCart = (): CartItems => ({
  products: [],
  total: 0,
  discountedTotal: 0,
  totalProducts: 0,
  totalQuantity: 0,
});

export const useCartLoader = routeLoader$(({ cookie }) => {
  const cartCookie = cookie.get(CART_STORAGE_KEY);
  if (cartCookie) {
    try {
      return cartCookie.json() as CartItems;
    } catch {
      return emptyCart();
    }
  }
  return emptyCart();
});

export const useGetProducts = routeLoader$(async () => {
  const res = await fetch("https://dummyjson.com/products?limit=600", {
    headers: { Accept: "application/json" },
  });
  return (await res.json()) as any;
});

export default component$(() => {
  const initialCart = useCartLoader();
  const cart = useStore<CartState>({ items: { value: initialCart.value } });

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

  useTask$(({ track }) => {
    track(() => cart.items.value);

    // run only on the browser to prevent running on the server
    if (isBrowser) {
      try {
        const cartString = encodeURIComponent(JSON.stringify(cart.items.value));
        const maxAge = 60 * 60 * 24 * 365; // 1 year expiration
        document.cookie = `${CART_STORAGE_KEY}=${cartString}; path=/; max-age=${maxAge}; SameSite=Lax`;
      } catch {
        // storage full or unavailable — silently ignore
      }
    }
  });

  useTask$(async ({ track }) => {
    track(() => searchInput.value);
    if (searchInput.value) {
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${searchInput.value}&limit=600`,
        {
          headers: { Accept: "application/json" },
        },
      );
      const products = await res.json();
      productList.items = products;
    }
  });

  return (
    <>
      <Cart openCart={openCart} />
      <Nav openCart={openCart} searchInput={searchInput} />
      <div class="layout__container">
        <Slot />
      </div>
      <Footer />
    </>
  );
});
