import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate, useLocation, routeLoader$ } from "@builder.io/qwik-city";
import { LuArrowLeft, LuMinus, LuPlus } from "@qwikest/icons/lucide";
import { useCartHook } from "~/hooks/cart";
import "./product.css";

export const useGetProduct = routeLoader$(async (location) => {
  const res = await fetch(
    `https://dummyjson.com/products/category/${location}`,
    {
      headers: { Accept: "application/json" },
    },
  );
  return (await res.json()) as any;
});

export default component$(() => {
  const navigate = useNavigate();
  const loc = useLocation();
  const product = useSignal<any>(null);
  const quantity = useSignal(1);

  const { addProductToCart } = useCartHook();

  const addToCart = $((item: any) => {
    addProductToCart(item.id, quantity.value, item);
  });

  useTask$(async ({ track }) => {
    track(() => loc.params.product);
    const res = await fetch(
      `https://dummyjson.com/products/${loc.params.product}`,
      {
        headers: { Accept: "application/json" },
      },
    );
    product.value = await res.json();
    quantity.value = 1;
  });

  return (
    <div class="product__page">
      <h1 class="product__back" role="button" onClick$={() => navigate(-1)}>
        <LuArrowLeft class="w-3 h-3 inline mr-2" />
        Back to shop
      </h1>
      <div class="product__details">
        <div class="product__media">
          <img
            src={product?.value?.images[0]}
            class="product__image"
            alt="product image"
            width={280}
            height={280}
          />
        </div>
        <div class="product__content">
          <div class="product__content__head">
            <h2>{product?.value?.title}</h2>
            <h3>About</h3>
            <p>{product?.value?.description}. </p>
          </div>
          <div class="product__content__cart">
            <div class="product__cart">
              <div class="product__quantity">
                <h4>Quantity:</h4>
                <div class="product__quantity__buttons">
                  <button
                    onClick$={() => {
                      if (quantity.value > 1) quantity.value -= 1;
                    }}
                  >
                    <LuMinus class="w-3 h-3 inline" />
                  </button>
                  <span role="button">{quantity.value}</span>
                  <button
                    onClick$={() => {
                      quantity.value += 1;
                    }}
                  >
                    <LuPlus class="w-3 h-3 inline" />
                  </button>
                </div>
              </div>
              <div class="product__price">
                <h4>{product?.value?.price} USDC</h4>
              </div>
            </div>
            <button
              class="product__cart__button"
              onClick$={() => {
                if (!product.value) return;
                addToCart(product);
                quantity.value = 1;
              }}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Product Page",
  meta: [
    {
      name: "product page",
      content: "This is the product page for our store",
    },
  ],
};
