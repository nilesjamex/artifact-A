import { $, component$, useSignal, useTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { CartItems } from "~/context/cart.context";
import "./search.css";

export const Search = component$(() => {
  const nav = useNavigate();
  const activeSearch = useSignal<string>();
  const searchItems = useSignal<CartItems>();
  const searchResult = $(async (value: string) => {
    activeSearch.value = value;
  });

  useTask$(async ({ track }) => {
    track(() => activeSearch.value);
    if (activeSearch.value) {
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${activeSearch.value}&limit=600`,
        {
          headers: { Accept: "application/json" },
        },
      );
      const products = await res.json();
      searchItems.value = products;
      console.log(searchItems);
    }
  });
  return (
    <div class="search__container">
      <input
        type="text"
        class="search"
        placeholder="search products..."
        onInput$={(_, target) => {
          searchResult(target.value);
        }}
        value={activeSearch.value}
      />
      {activeSearch.value && (
        <div class="search__dropdown">
          {searchItems.value?.products.map((item, idx) => (
            <div
              class="search__item"
              key={idx}
              onClick$={() => {
                nav(`/shop/${item.id}`);
                activeSearch.value = "";
              }}
            >
              <img src={item.thumbnail} width={70} height={70} alt="" />
              <h5>{item.title}</h5>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
