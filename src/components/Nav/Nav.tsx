import { component$, useSignal, type Signal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import "./Nav.css";

export interface NavProps {
  openCart: Signal<boolean>;
}

export const Nav = component$<NavProps>(({ openCart }) => {
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
        <button
          type="button"
          onClick$={() => {
            openCart.value = !openCart.value;
            console.log(openCart.value);
          }}
        >
          cart ({cartCount.value})
        </button>
      </div>
    </div>
  );
});
