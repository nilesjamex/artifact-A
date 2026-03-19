import { $, useStore, useContext } from "@builder.io/qwik";
import { CartState, CartProduct, CartContext } from "~/context/cart.context";

export const useCartHook = () => {
  const cartStore = useStore<CartState>({
    items: {
      value: {
        products: [],
        total: 0,
        discountedTotal: 0,
        totalProducts: 0,
        totalQuantity: 0,
      },
    },
  });
  const cart = useContext(CartContext);

  const getCart = $(async () => {
    const res = await fetch(`https://dummyjson.com/carts/10`, {
      headers: { Accept: "application/json" },
    });
    const data = await res.json();
    cartStore.items.value = data;
  });

  const addProductToCart = $(
    async (id: number, quantity: number, item: any) => {
      await fetch(`https://dummyjson.com/carts/10`, {
        method: `PUT`,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merge: true,
          products: [{ id, quantity }],
        }),
      });
      const current = cart.items.value;
      const existing = current.products.find(
        (p: CartProduct) => p.id === item.id,
      );
      let updated: CartProduct[];
      if (existing) {
        updated = current.products.map((p: CartProduct) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      } else {
        updated = [
          ...current.products,
          {
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: 1,
            thumbnail: item.images[0],
          },
        ];
      }
      const newTotal = updated.reduce(
        (sum: number, p: CartProduct) => sum + p.price * p.quantity,
        0,
      );
      cart.items.value = {
        ...current,
        products: updated,
        totalProducts: updated.length,
        totalQuantity: updated.reduce(
          (sum: number, p: CartProduct) => sum + p.quantity,
          0,
        ),
        total: parseFloat(newTotal.toFixed(2)),
      };
    },
  );

  const removeFromCart = $((item: any) => {
    const current = cart.items.value;
    const updated = current.products.filter((p: any) => p.id !== item.id);
    const newTotal = updated.reduce(
      (sum: number, p: any) => sum + p.price * p.quantity,
      0,
    );
    cart.items.value = {
      ...current,
      products: updated,
      totalProducts: updated.length,
      totalQuantity: updated.reduce(
        (sum: number, p: any) => sum + p.quantity,
        0,
      ),
      total: parseFloat(newTotal.toFixed(2)),
    };
  });

  const updateQuantity = $((item: any) => {
    const cartData = cart.items.value;

    // Find the specific item proxy
    const targetProduct = cartData.products.find(
      (p: CartProduct) => p.id === item.id,
    );

    if (targetProduct) {
      // 1. Mutate the property directly!
      targetProduct.quantity += 1;
      cartData.totalQuantity += 1;

      // 2. Recalculate totals
      const newTotal = cartData.products.reduce(
        (sum: number, p: CartProduct) => sum + p.price * p.quantity,
        0,
      );
      cartData.total = parseFloat(newTotal.toFixed(2));
    }
  });

  const reduceQuantity = $((item: any) => {
    const cartData = cart.items.value;

    // Find the index so we can safely remove it if quantity hits 0
    const targetIndex = cartData.products.findIndex(
      (p: CartProduct) => p.id === item.id,
    );

    if (targetIndex !== -1) {
      const targetProduct = cartData.products[targetIndex];

      // Mutate directly
      targetProduct.quantity -= 1;
      cartData.totalQuantity -= 1;

      // If the user reduces quantity to 0, completely remove the item
      if (targetProduct.quantity <= 0) {
        cartData.products.splice(targetIndex, 1);
        cartData.totalProducts = cartData.products.length;
      }

      // Recalculate totals
      const newTotal = cartData.products.reduce(
        (sum: number, p: CartProduct) => sum + p.price * p.quantity,
        0,
      );
      cartData.total = parseFloat(newTotal.toFixed(2));
    }
  });

  return {
    addProductToCart,
    removeFromCart,
    updateQuantity,
    reduceQuantity,
    getCart,
    cartStore,
  };
};
