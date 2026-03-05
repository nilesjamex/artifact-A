import { component$, Slot, useSignal } from "@builder.io/qwik";
import { Footer } from "~/components/Footer/Footer";
import { Nav } from "~/components/Nav/Nav";
import { Cart } from "~/components/Cart";

export default component$(() => {
  const openCart = useSignal(false);
  // const toggleCart$ = () => {
  //   openCart.value = !openCart.value;
  // };
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
