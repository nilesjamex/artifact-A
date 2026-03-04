import { component$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import "./Nav.css";

// export interface NavProps {

// }

export const Nav = component$(() => {
  const cartCount = useSignal(0);
  return (
    <div class="navbar">
      <Link href="/">
        <h1 role="button" class="navbar__storefront">
          StoreFront
        </h1>
      </Link>
      <div class="navbar__links">
        <Link href="/shop">
          <button type="button">shop</button>
        </Link>
        <button type="button">cart ({cartCount.value})</button>
      </div>
    </div>
  );
});
