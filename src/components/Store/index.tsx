import { $, component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { LuShoppingBasket } from "@qwikest/icons/lucide";
import { useCartHook } from "~/hooks/cart";
import "./store.css";

export interface ProductProps {
  product: any;
}

export const Store = component$<ProductProps>(({ product }) => {
  const nav = useNavigate();
  const products = product.items?.products ?? [];

  const { addProductToCart } = useCartHook();

  const addToCart = $((item: any) => {
    addProductToCart(item.id, 1, item);
  });

  return (
    <div class="storefront">
      <div class="storefront__header">
        <h1 class="storefront__title">Welcome to your StoreFront</h1>
        <h2 class="storefront__description">Powered by Filament.</h2>
      </div>
      <div class="storefront__product">
        <h3>All Products</h3>
        <div class="storefront__cards">
          {products.map((item: any) => (
            <div class="storefront__card" key={item.id}>
              <div
                class="image__container"
                onClick$={() => {
                  nav(`/shop/${item.id}`);
                }}
              >
                <img
                  src={item.images[0]}
                  class="product__image"
                  alt="product image"
                  width={280}
                  height={280}
                />
              </div>
              <div class="storefront__card__text">
                <h4 class="product__title">{item.title}</h4>
                <h5 class="product__price">{item.price} USDC</h5>
              </div>
              <button class="product__button" onClick$={() => addToCart(item)}>
                Add to cart <LuShoppingBasket />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
