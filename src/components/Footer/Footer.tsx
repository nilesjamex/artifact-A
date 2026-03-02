import { component$ } from "@builder.io/qwik";
import "./footer.css";

// export interface FooterProps {

// }

export const Footer = component$(() => {
  return (
    <div class="footer">
      <div class="footer__info">
        <h1>Storefront</h1>
        <h2>© Copyright FIlament 2024</h2>
      </div>
      <h3>Developed by Niles</h3>
    </div>
  );
});
