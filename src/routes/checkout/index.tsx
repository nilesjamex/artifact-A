import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { CheckOutCart } from "~/components/Checkout/Cart";

export default component$(() => {
  return (
    <div class="checkout">
      <CheckOutCart />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Store Checkout",
  meta: [
    {
      name: "StoreFront Checkout Page",
      content: "Finalize your cart and purchase your item",
    },
  ],
};
