import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Store } from "../components/Store";

export default component$(() => {
  return (
    <>
      {/* <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
      </div> */}
      <Store />
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
