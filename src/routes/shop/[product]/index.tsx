import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useNavigate } from "@builder.io/qwik-city";
import { LuArrowLeft, LuMinus, LuPlus } from "@qwikest/icons/lucide";
import "./product.css";
import Product from "~/assets/product-big.png?quality=80&format=webp&jsx";

export default component$(() => {
  const navigate = useNavigate();
  return (
    <div class="product__page">
      <h1 class="product__back" role="button" onClick$={() => navigate(-1)}>
        <LuArrowLeft class="w-3 h-3 inline mr-2" />
        Back to shop
      </h1>
      <div class="product__details">
        <div class="product__media">
          <Product class="product__image" alt="product image" />
        </div>
        <div class="product__content">
          <div class="product__content__head">
            <h2>Notebook</h2>
            <h3>About</h3>
            <p>
              Capture your thoughts in style with our premium notebook.
              Featuring 192 pages of high-quality, acid-free 80 gsm paper, this
              A5-sized notebook is perfect for journaling, sketching, or
              note-taking. The hardcover design, bound in durable linen,
              protects your ideas and lies flat when open.{" "}
            </p>
          </div>
          <div class="product__content__cart">
            <div class="product__cart">
              <div class="product__quantity">
                <h4>Quantity:</h4>
                <div class="product__quantity__buttons">
                  <button>
                    <LuMinus class="w-3 h-3 inline" />
                  </button>
                  <span role="button">1</span>
                  <button>
                    <LuPlus class="w-3 h-3 inline" />
                  </button>
                </div>
              </div>
              <div class="product__price">
                <h4>9.99 USDC</h4>
              </div>
            </div>
            <button class="product__cart__button">Add to cart</button>
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
