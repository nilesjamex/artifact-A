import { component$, useSignal } from "@builder.io/qwik";
import { LuChevronRight, LuMinus, LuPlus, LuX } from "@qwikest/icons/lucide";
import Media from "../../assets/cart.png?quality=80&jsx";
import "./checkout.css";

export const CheckOutCart = component$(() => {
  const breadcrumb = useSignal(1);
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
    <div class="ccart">
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
      <div class="ccart__content">
        <div class="ccart__items">
          <h2>
            Cart{" "}
            <span>
              <span>&#40;{cartItems.length} items&#41;</span>
            </span>
          </h2>
          {cartItems.map((item) => (
            <div class="ccart__item" key={item.id}>
              <div class="ccart__img">
                <item.imageUrl />
              </div>

              <div class="ccart__item__content">
                <div class="ccart__item__name">
                  <h4>{item.name}</h4>
                  <div class="ccart__x">
                    <LuX />
                  </div>
                </div>
                <div class="ccart__item__price">
                  <div class="ccart__quantity__buttons">
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

        <div class="ccart__price">
          <h2>Price details</h2>
          <div class="ccart__prices">
            <div>
              <h5>Subtotal</h5>
              <h6>112.96 USDC</h6>
            </div>
            <div>
              <h5>Taxes</h5>
              <h6>112.96 USDC</h6>
            </div>
            <div>
              <h5>Total</h5>
              <h6>112.96 USDC</h6>
            </div>
          </div>
          <button>Place Order</button>
        </div>
      </div>
    </div>
  );
});
