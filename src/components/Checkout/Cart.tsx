import { component$, useContext, type Signal } from "@builder.io/qwik";
import { LuMinus, LuPlus, LuX } from "@qwikest/icons/lucide";
import "./checkout.css";
import { CartContext } from "~/context/cart.context";
import type { CartProduct } from "~/context/cart.context";
import { useCartHook } from "~/hooks/cart";

export interface StageProp {
  step: Signal<number>;
}

export const CheckOutCart = component$<StageProp>(({ step }) => {
  const cart = useContext(CartContext);
  const { updateQuantity, reduceQuantity, removeFromCart } = useCartHook();
  return (
    <div class="ccart">
      <div class="ccart__content">
        <div class="ccart__items">
          <h2>
            Cart <span>&#40;{cart.items.value.totalProducts} items&#41;</span>
          </h2>
          {cart.items.value.products.map((item: CartProduct) => (
            <div class="ccart__item" key={item.id}>
              <div class="ccart__img">
                <img
                  src={item.thumbnail}
                  class="product__image"
                  alt="product image"
                  width={80}
                  height={80}
                />
              </div>

              <div class="ccart__item__content">
                <div class="ccart__item__name">
                  <h4>{item.title}</h4>
                  <div
                    class="ccart__x"
                    role="button"
                    aria-label="Remove item"
                    onClick$={() => {
                      removeFromCart(item);
                    }}
                  >
                    <LuX />
                  </div>
                </div>
                <div class="ccart__item__price">
                  <div class="ccart__quantity__buttons">
                    <button
                      onClick$={() => {
                        reduceQuantity(item);
                      }}
                    >
                      <LuMinus class="w-3 h-3 inline" />
                    </button>
                    <span role="button">{item.quantity}</span>
                    <button
                      onClick$={() => {
                        updateQuantity(item);
                      }}
                    >
                      <LuPlus class="w-3 h-3 inline" />
                    </button>
                  </div>
                  <h5>{item.price} USDC</h5>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div class="ccart__price">
          <h2>Price details</h2>
          <div class="ccart__prices">
            <div>
              <h5>Subtotal</h5>
              <h6>{cart.items.value.total} USDC</h6>
            </div>
            <div>
              <h5>Taxes (10%)</h5>
              <h6>{(cart.items.value.total * 0.1).toFixed(2)} USDC</h6>
            </div>
            <div>
              <h5>Total</h5>
              <h6>
                {(
                  cart.items.value.total * 0.1 +
                  cart.items.value.total
                ).toFixed(2)}
                USDC
              </h6>
            </div>
          </div>
          <button
            onClick$={() => {
              step.value = 2;
            }}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
});
