import { component$, useContext, type Signal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import "./cart.css";
import { LuChevronRight, LuMinus, LuPlus, LuX } from "@qwikest/icons/lucide";
import { CartContext } from "~/context/cart.context";

export interface CartProps {
  openCart: Signal<boolean>;
}

export const Cart = component$<CartProps>(({ openCart }) => {
  const cart = useContext(CartContext);
  return (
    <div class={`cart ${openCart.value ? "" : "active"}`}>
      <div class={`cart__content ${openCart.value ? "" : "active"}`}>
        <div class="cart__header">
          <h4>
            Cart <span>&#40;{cart.items.value.totalProducts} items&#41;</span>
          </h4>
          <div
            class="cart__header__close"
            onClick$={() => {
              openCart.value = !openCart.value;
            }}
          >
            <LuChevronRight />
          </div>
        </div>
        <div class="cart__middle">
          {cart.items.value.products.map((item: any) => (
            <div class="cart__item" key={item.id}>
              <div class="cart__img">
                <img
                  src={item.thumbnail}
                  class="product__image"
                  alt="product image"
                  width={80}
                  height={80}
                />
              </div>

              <div class="cart__item__content">
                <div class="cart__item__name">
                  <h4>{item.title}</h4>
                  <div class="cart__icon">
                    <LuX />
                  </div>
                </div>
                <div class="cart__item__price">
                  <div class="cart__quantity__buttons">
                    <button>
                      <LuMinus class="w-3 h-3 inline" />
                    </button>
                    <span role="button">{item.quantity}</span>
                    <button>
                      <LuPlus class="w-3 h-3 inline" />
                    </button>
                  </div>
                  <h5>{item.price}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div class="cart__bottom">
          <div class="cart__bottom__subtotal">
            <h5>Subtotal</h5>
            <h6>{cart.items.value.total} USDC</h6>
          </div>
          <Link href="/checkout">
            <button
              onClick$={() => {
                openCart.value = !openCart.value;
              }}
            >
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
});
