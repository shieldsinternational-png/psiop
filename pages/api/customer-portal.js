import Stripe from "stripe";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const customerId = user.publicMetadata?.stripeCustomerId;

    if (!customerId) {
      return res.status(400).json({ error: "No Stripe customer found" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Customer portal error:", err);
    res.status(500).json({ error: "Failed to create portal session" });
  }
}
