import { component$, useSignal } from "@builder.io/qwik";
import "./Nav.css";

// export interface NavProps {

// }

export const Nav = component$(() => {
  const cartCount = useSignal(0);
  return (
    <div class="navbar">
      <h1 class="navbar__storefront">StoreFront</h1>
      <div class="navbar__links">
        <button type="button">shop</button>
        <button type="button">cart ({cartCount.value})</button>
      </div>
    </div>
  );
});
