import { component$, type Signal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { useContext } from "@builder.io/qwik";
import { CartContext } from "~/context/cart.context";
import "./Nav.css";

export interface NavProps {
  openCart: Signal<boolean>;
}

export const Nav = component$<NavProps>(({ openCart }) => {
  const cart = useContext(CartContext);
  console.log(cart.items.value);
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
          }}
        >
          cart ({cart.items.value.totalProducts})
        </button>
      </div>
    </div>
  );
});
