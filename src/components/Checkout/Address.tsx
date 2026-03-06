import { component$ } from "@builder.io/qwik";
import "./address.css";
import Media from "../../assets/cart.png?quality=80&jsx";

// export interface AddressProp {
//   step: Signal<number>;
// }

export const CheckoutAddress = component$(() => {
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
    <div class="address">
      <div class="address__content">
        <div class="address__contact">
          <h4>Customer info</h4>
          <div class="address__info">
            <div class="address__info__cont">
              <div>
                <label for="firstName">First Name</label>
                <input type="text" name="firstName" placeholder="First Name" />
              </div>
              <div>
                <label for="lastName">Last Name</label>
                <input type="text" name="lastName" placeholder="Last Name" />
              </div>
            </div>
            <div class="address__info__cont">
              <div>
                <label for="email">Email</label>
                <input type="email" name="email" placeholder="Email" />
              </div>
              <div>
                <label for="phone">Phoe Number</label>
                <input type="tel" name="phone" placeholder="Phone Number" />
              </div>
            </div>
            <div class="address__info__cont nb">
              <div>
                <label for="address">Address Line</label>
                <input
                  type="address"
                  name="address"
                  placeholder="Street address, P.O. Box, company name, c/o"
                />
              </div>
            </div>
            <div class="address__info__cont nb">
              <div>
                <label for="city">City</label>
                <input type="text" name="city" placeholder="City" />
              </div>
              <div>
                <label for="state">State/Province/Region</label>
                <input
                  type="text"
                  name="state"
                  placeholder="State/Province/Region"
                />
              </div>
            </div>
            <div class="address__info__cont nb">
              <div>
                <label for="postcode">Postal Code</label>
                <input type="tel" name="postcode" placeholder="Postal Code" />
              </div>
              <div>
                <label for="country">Country</label>
                <input type="text" name="country" placeholder="Country" />
              </div>
            </div>
          </div>
        </div>
        <div class="address__order">
          <h4>
            Order Summary <span>&#40;{cartItems.length} items&#41;</span>
          </h4>
          <div class="address__summary">
            {cartItems.map((item) => (
              <div class="ccart__item" key={item.id}>
                <div class="ccart__img">
                  <item.imageUrl />
                </div>

                <div class="ccart__item__content">
                  <div class="ccart__item__name">
                    <h4>{item.name}</h4>
                  </div>
                  <div class="ccart__item__price">
                    <h5>1 X {item.price} USDC</h5>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
});
