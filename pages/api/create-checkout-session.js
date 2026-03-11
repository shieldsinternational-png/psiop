import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { priceId, email } = req.body;

  if (!priceId) return res.status(400).json({ error: "Missing priceId" });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://psiop.io"}/?session=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://psiop.io"}/?session=cancelled`,
      metadata: { source: "psiop_stargate" },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(500).json({ error: err.message });
  }
}
