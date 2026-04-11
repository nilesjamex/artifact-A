import { $, component$, useSignal, useTask$, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import {
  LuArrowUpDown,
  LuCheck,
  LuShoppingBasket,
} from "@qwikest/icons/lucide";
import { routeLoader$ } from "@builder.io/qwik-city";
import { ProductState } from "~/context/product.context";
import { useCartHook } from "~/hooks/cart";
import "./shop.css";

export const useGetProducts = routeLoader$(async () => {
  const res = await fetch("https://dummyjson.com/products?limit=600", {
    headers: { Accept: "application/json" },
  });
  return (await res.json()) as any;
});

export default component$(() => {
  const categories = [
    { id: 1, name: "All", code: "" },
    { id: 2, name: "Beauty", code: "/category/beauty" },
    { id: 3, name: "Furnitures", code: "/category/furniture" },
    { id: 4, name: "Fragrances", code: "/category/fragrances" },
    { id: 5, name: "Groceries", code: "/category/groceries" },
  ];
  const filters = [
    { id: 1, name: "Newest", sortBy: "id", order: "desc" },
    { id: 2, name: "Oldest", sortBy: "id", order: "asc" },
    { id: 3, name: "Lowest Price", sortBy: "price", order: "asc" },
    { id: 4, name: "Highest Price", sortBy: "price", order: "desc" },
  ];

  const allProducts = useGetProducts();
  const productList = useStore<ProductState>({ items: { products: [] } });

  const { addProductToCart } = useCartHook();
  const addToCart = $((item: any) => {
    addProductToCart(item.id, 1, item);
  });

  useTask$(({ track }) => {
    track(() => allProducts.value);
    if (allProducts.value) {
      productList.items = allProducts.value;
    }
  });

  const selectedCategory = useSignal(1);
  const showFilter = useSignal(false);
  const selectedFilter = useSignal(0);
  const products = productList.items;

  useTask$(async ({ track }) => {
    const filterId = track(() => selectedFilter.value);
    const categoryId = track(() => selectedCategory.value);

    const filter = filters.find((f) => f.id === filterId);
    const category = categories.find((c) => c.id === categoryId);
    const sortParams = filter
      ? `?sortBy=${filter.sortBy}&order=${filter.order}`
      : "";

    if (categoryId === 1) {
      if (!filter) {
        products.value = productList.items;
        return;
      }
      const res = await fetch(
        `https://dummyjson.com/products?limit=60&sortBy=${filter.sortBy}&order=${filter.order}`,
        { headers: { Accept: "application/json" } },
      );
      const data = await res.json();
      productList.items = data;
      products.value = productList.items;
      return;
    }

    const res = await fetch(
      `https://dummyjson.com/products${category!.code}${sortParams}`,
      { headers: { Accept: "application/json" } },
    );
    const data = await res.json();
    productList.items = data;
    products.value = productList.items;
  });

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
            aria-label="sort"
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
                  aria-label={filter.name}
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
        {products.value?.products?.map((product: any) => (
          <div class="shop__card" key={product.id}>
            <Link href={`/shop/${product.id}`} class="shop__card__link">
              <div class="image__container">
                <img
                  src={product.thumbnail}
                  class="product__image"
                  alt="product image"
                  width={280}
                  height={280}
                />
              </div>
              <div class="shop__card__text">
                <h4 class="product__title">{product.title}</h4>
                <h5 class="product__price">{product.price} USDC</h5>
              </div>
            </Link>
            <button
              onClick$={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
            >
              Add to cart <LuShoppingBasket />
            </button>
          </div>
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
        "Welcome to StoreFront! Explore our exclusive merchandise, including T-shirts, mugs, and sticker packs. Show off your love for Postman with our high-quality products designed for developers and API enthusiasts alike.",
    },
  ],
};
