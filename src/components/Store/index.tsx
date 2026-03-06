import { component$, type Signal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { LuShoppingBasket } from "@qwikest/icons/lucide";
// import type { DocumentHead } from "@builder.io/qwik-city";
import "./store.css";
// import Product from "../../assets/product.png?quality=100&jsx";

export interface ProductProps {
  product: Signal<any>;
}

export const Store = component$<ProductProps>(({ product }) => {
  // const products = [
  //   {
  //     id: 1,
  //     name: "Postman T-Shirt",
  //     price: 15.99,
  //     image: Product,
  //   },
  //   {
  //     id: 2,
  //     name: "Postman Mug",
  //     price: 9.99,
  //     image: Product,
  //   },
  //   {
  //     id: 3,
  //     name: "Postman Sticker Pack",
  //     price: 4.99,
  //     image: Product,
  //   },
  //   {
  //     id: 1,
  //     name: "Postman T-Shirt",
  //     price: 15.99,
  //     image: Product,
  //   },
  //   {
  //     id: 2,
  //     name: "Postman Mug",
  //     price: 9.99,
  //     image: Product,
  //   },
  //   {
  //     id: 3,
  //     name: "Postman Sticker Pack",
  //     price: 4.99,
  //     image: Product,
  //   },
  //   {
  //     id: 1,
  //     name: "Postman T-Shirt",
  //     price: 15.99,
  //     image: Product,
  //   },
  //   {
  //     id: 2,
  //     name: "Postman Mug",
  //     price: 9.99,
  //     image: Product,
  //   },
  //   {
  //     id: 3,
  //     name: "Postman Sticker Pack",
  //     price: 4.99,
  //     image: Product,
  //   },
  // ];
  const products = product.value.products;
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
            <Link href={`/shop/${item.id}`} key={item.id}>
              <div class="storefront__card">
                <div class="image__container">
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
                <button>
                  Add to cart <LuShoppingBasket />
                </button>
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
