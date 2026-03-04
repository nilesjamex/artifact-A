import { component$ } from "@builder.io/qwik";
import "./completed.css";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  return (
    <div class="order__body">
      <div class="content">
        <div class="content__check">
          <LuCheck class="icon" />
        </div>
        <h1>Thanks for your order!</h1>
        <h2>
          We have sent the order confirmation details to{" "}
          <span>customer.email@gmail.com</span>
        </h2>
        <button>Back to home</button>
      </div>
    </div>
  );
});
