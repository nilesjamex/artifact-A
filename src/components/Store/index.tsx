import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
// import type { DocumentHead } from "@builder.io/qwik-city";
import "./store.css";
import Product from "../../assets/product.png?quality=100&jsx";

export const Store = component$(() => {
  const products = [
    {
      id: 1,
      name: "Postman T-Shirt",
      price: 15.99,
      image: Product,
    },
    {
      id: 2,
      name: "Postman Mug",
      price: 9.99,
      image: Product,
    },
    {
      id: 3,
      name: "Postman Sticker Pack",
      price: 4.99,
      image: Product,
    },
    {
      id: 1,
      name: "Postman T-Shirt",
      price: 15.99,
      image: Product,
    },
    {
      id: 2,
      name: "Postman Mug",
      price: 9.99,
      image: Product,
    },
    {
      id: 3,
      name: "Postman Sticker Pack",
      price: 4.99,
      image: Product,
    },
    {
      id: 1,
      name: "Postman T-Shirt",
      price: 15.99,
      image: Product,
    },
    {
      id: 2,
      name: "Postman Mug",
      price: 9.99,
      image: Product,
    },
    {
      id: 3,
      name: "Postman Sticker Pack",
      price: 4.99,
      image: Product,
    },
  ];
  return (
    <div class="storefront">
      <div class="storefront__header">
        <h1 class="storefront__title">Welcome to your StoreFront</h1>
        <h2 class="storefront__description">Powered by Filament.</h2>
      </div>
      <div class="storefront__product">
        <h3>All Products</h3>
        <div class="storefront__cards">
          {products.map((product) => (
            <Link href={`/shop/${product.id}`} key={product.id}>
              <div class="storefront__card">
                <div class="image__container">
                  <product.image class="product__image" alt="product image" />
                </div>
                <div class="storefront__card__text">
                  <h4 class="product__title">{product.name}</h4>
                  <h5 class="product__price">{product.price} USDC</h5>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
});

// export const head: DocumentHead = {
//   title: "StoreFront",
//   meta: [
//     {
//       name: "description",
//       content:
//         "Welcome to the StoreFront, where you can find the best products at unbeatable prices.",
//     },
//   ],
// };
