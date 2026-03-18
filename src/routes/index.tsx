import { component$, useContext } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { Store } from "../components/Store";
import { ProductContext } from "~/context/product.context";

export const useGetProducts = routeLoader$(async () => {
  const res = await fetch("https://dummyjson.com/products?limit=600", {
    headers: { Accept: "application/json" },
  });
  return (await res.json()) as any;
});

export default component$(() => {
  const product = useContext(ProductContext);
  return (
    <>
      <Store product={product} />
    </>
  );
});

export const head: DocumentHead = {
  title: "StoreFront",
  meta: [
    {
      name: "description",
      content:
        "Welcome to the StoreFront, where you can find the best products at unbeatable prices.",
    },
  ],
};
