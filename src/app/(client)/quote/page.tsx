import { redirect } from "next/navigation";

// The quote system has been replaced with an e-commerce cart.
// Redirect any saved /quote links to the new /cart page.
export default function QuotePage() {
  redirect("/cart");
}
