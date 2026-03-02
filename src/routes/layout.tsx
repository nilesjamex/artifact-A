import { component$, Slot } from "@builder.io/qwik";
import { Footer } from "~/components/Footer/Footer";
import { Nav } from "~/components/Nav/Nav";

export default component$(() => {
  return (
    <>
      <Nav />
      <div class="layout__container">
        <Slot />
      </div>
      <Footer />
    </>
  );
});
