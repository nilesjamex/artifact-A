import {
  component$,
  Slot,
  useSignal,
  useContextProvider,
  useStore,
} from "@builder.io/qwik";
import { Footer } from "~/components/Footer/Footer";
import { Nav } from "~/components/Nav/Nav";
import { Cart } from "~/components/Cart";
import { CartContext, CartState } from "~/context/cart.context";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useGetCart = routeLoader$(async () => {
  const res = fetch(`https://dummyjson.com/carts/10`, {
    headers: { Accept: "application/json" },
  });
  return (await res).json() as any;
});

export default component$(() => {
  const cart = useStore<CartState>({ items: useGetCart() });
  useContextProvider(CartContext, cart);
  const openCart = useSignal(false);

  return (
    <>
      {/* {openCart.value && <Cart openCart={openCart} />} */}
      <Cart openCart={openCart} />
      <Nav openCart={openCart} />
      <div class="layout__container">
        <Slot />
      </div>
      <Footer />
    </>
  );
});
