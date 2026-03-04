import { component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { LuArrowUpDown, LuCheck } from "@qwikest/icons/lucide";
import Product from "../../assets/product.png?quality=100&jsx";
import "./shop.css";

export default component$(() => {
  const categories = [
    {
      id: 1,
      name: "All",
    },
    {
      id: 2,
      name: "Accessories",
    },
    {
      id: 3,
      name: "Apparel",
    },
    {
      id: 4,
      name: "Kitchen",
    },
    {
      id: 5,
      name: "Books",
    },
  ];
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
  const filters = [
    {
      id: 1,
      name: "Newest",
    },
    {
      id: 2,
      name: "Oldest",
    },
    {
      id: 3,
      name: "Lowest Price",
    },
    {
      id: 4,
      name: "Highest Price",
    },
  ];
  const selectedCategory = useSignal(1);
  const showFilter = useSignal(false);
  const selectedFilter = useSignal(1);
  // const toggleFilter = (id) => {
  //   if (selectedFilter.value !== id) {
  //     selectedFilter.value = id;
  //   }
  // }
  return (
    <>
      <div class="shop__header">
        <div class="shop__category">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              class={category.id === selectedCategory.value ? "active" : ""}
              onClick$={() => {
                selectedCategory.value = category.id;
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        <div class="shop__filter">
          <button
            type="button"
            onClick$={() => {
              showFilter.value = !showFilter.value;
            }}
          >
            <LuArrowUpDown class="w-8 h-8" />
          </button>
          {showFilter.value && (
            <div class="shop__filter__dropdown">
              {filters.map((filter) => (
                <button
                  class={filter.id === selectedFilter.value ? "active" : ""}
                  key={filter.id}
                  onClick$={() => {
                    if (selectedFilter.value !== filter.id) {
                      selectedFilter.value = filter.id;
                      showFilter.value = false;
                    } else {
                      showFilter.value = false;
                    }
                  }}
                >
                  {filter.name}
                  {filter.id === selectedFilter.value && (
                    <LuCheck class="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div class="shop__cards">
        {products.map((product) => (
          <Link
            href={`/shop/${product.id}`}
            class="shop__card"
            key={product.id}
          >
            <div class="shop__card">
              <div class="image__container">
                <product.image class="product__image" alt="product image" />
              </div>
              <div class="shop__card__text">
                <h4 class="product__title">{product.name}</h4>
                <h5 class="product__price">{product.price} USDC</h5>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Shop",
  meta: [
    {
      name: "shop Main Shop Page",
      content:
        "Welcome to the Postman Store! Explore our exclusive merchandise, including T-shirts, mugs, and sticker packs. Show off your love for Postman with our high-quality products designed for developers and API enthusiasts alike.",
    },
  ],
};
