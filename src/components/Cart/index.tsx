import { component$, type Signal } from "@builder.io/qwik";
import "./cart.css";
import { LuChevronRight, LuMinus, LuPlus, LuX } from "@qwikest/icons/lucide";
import Media from "../../assets/cart.png?quality=80&jsx";

export interface CartProps {
  openCart: Signal<boolean>;
}

export const Cart = component$<CartProps>(({ openCart }) => {
  const cartItems = [
    {
      id: 1,
      name: "Notebook",
      price: 12.99,
      quantity: 2,
      imageUrl: Media,
    },
    {
      id: 1,
      name: "Notebook",
      price: 12.99,
      quantity: 2,
      imageUrl: Media,
    },
    {
      id: 1,
      name: "Notebook",
      price: 12.99,
      quantity: 2,
      imageUrl: Media,
    },
    {
      id: 1,
      name: "Notebook",
      price: 12.99,
      quantity: 2,
      imageUrl: Media,
    },
  ];
  return (
    <div class={`cart ${openCart.value ? "" : "active"}`}>
      <div class={`cart__content ${openCart.value ? "" : "active"}`}>
        <div class="cart__header">
          <h4>
            Cart <span>&#40;0 items&#41;</span>
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
          {cartItems.map((item) => (
            <div class="cart__item" key={item.id}>
              <div class="cart__img">
                <item.imageUrl />
              </div>

              <div class="cart__item__content">
                <div class="cart__item__name">
                  <h4>{item.name}</h4>
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
            <h6>112.96 USDC</h6>
          </div>
          <button>Checkout</button>
        </div>
      </div>
    </div>
  );
});
