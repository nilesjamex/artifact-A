import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { CheckOutCart } from "~/components/Checkout/Cart";
import { CheckoutAddress } from "~/components/Checkout/Address";
import { LuChevronRight } from "@qwikest/icons/lucide";
import "./checkout.css";

export default component$(() => {
  const breadcrumb = useSignal(1);
  return (
    <div class="checkout">
      <div class="ccart__breadcrumb">
        <h5
          class={`${breadcrumb.value === 1 ? "active" : ""}`}
          onClick$={() => {
            breadcrumb.value = 1;
          }}
          role="button"
        >
          Cart
        </h5>
        <LuChevronRight class="ccart__chevron" />
        <h5
          class={`${breadcrumb.value === 2 ? "active" : ""}`}
          onClick$={() => {
            breadcrumb.value = 2;
          }}
          role="button"
        >
          Address
        </h5>
      </div>
      {breadcrumb.value === 1 && <CheckOutCart step={breadcrumb} />}
      {breadcrumb.value === 2 && <CheckoutAddress />}
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
