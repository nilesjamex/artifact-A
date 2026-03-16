import { $, useStore } from "@builder.io/qwik";
// import { CartContext } from "~/context/cart.context";
import { CartState } from "~/context/cart.context";

export const useCartHook = () => {
  //   const cart = useContext(CartContext);
  const cartStore = useStore<CartState>({ items: [] });

  const getCart = $(async () => {
    const res = await fetch(`https://dummyjson.com/carts/10`, {
      headers: { Accept: "application/json" },
    });
    cartStore.items.value = res.json();
  });
  const addToCart = $(async (id: number, quantity: number) => {
    const res = await fetch(`https://dummyjson.com/carts/10`, {
      method: `PUT`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merge: true,
        products: [
          {
            id: id,
            quantity: quantity,
          },
        ],
      }),
    });
    const data = await res.json();
    cartStore.items.value = data.products;
    await getCart();
  });

  return { addToCart, cartStore };
};
