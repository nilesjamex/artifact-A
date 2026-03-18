import { $, component$, type Signal } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { useContext } from "@builder.io/qwik";
import { CartContext } from "~/context/cart.context";
import "./Nav.css";

export interface NavProps {
  openCart: Signal<boolean>;
  searchInput: Signal<string>;
}

export const Nav = component$<NavProps>(({ openCart, searchInput }) => {
  const textInput = $(() => {});
  const searchResult = $(async (value: string) => {
    searchInput.value = value;
  });
  const cart = useContext(CartContext);
  const loc = useLocation()
  return (
    <div class="navbar">
      <Link href="/">
        <h1 role="button" class="navbar__storefront">
          StoreFront
        </h1>
      </Link>
      {loc.url.pathname === `/` && <input
        type="text"
        class="search"
        placeholder="search products..."
        onInput$={(_, target) => {
          textInput();
          searchResult(target.value);
        }}
      />}
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
