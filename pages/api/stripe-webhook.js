import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  const client = await clerkClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const email = session.customer_email || session.customer_details?.email;
        const subscriptionId = session.subscription;
        const customerId = session.customer;

        if (email) {
          const users = await client.users.getUserList({ emailAddress: [email] });
          console.log(`Looking up email: ${email}, found: ${users.data.length} users`);
          if (users.data.length > 0) {
            const user = users.data[0];
            console.log(`Updating user ${user.id} metadata`);
            await client.users.updateUserMetadata(user.id, {
              publicMetadata: {
                subscribed: true,
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                subscribedAt: new Date().toISOString(),
              },
            });
            console.log(`Subscription activated for ${email}`);
          } else {
            console.log(`No user found for email: ${email}`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find user by stripeCustomerId in metadata
        const users = await client.users.getUserList({ limit: 500 });
        const user = users.data.find(
          (u) => u.publicMetadata?.stripeCustomerId === customerId
        );

        if (user) {
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              subscribed: false,
              cancelledAt: new Date().toISOString(),
            },
          });
          console.log(`Subscription cancelled for user ${user.id}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const isActive = ["active", "trialing"].includes(subscription.status);

        const users = await client.users.getUserList({ limit: 500 });
        const user = users.data.find(
          (u) => u.publicMetadata?.stripeCustomerId === customerId
        );

        if (user) {
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              subscribed: isActive,
              subscriptionStatus: subscription.status,
            },
          });
          console.log(`Subscription updated for user ${user.id}: ${subscription.status}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: "Webhook handler failed" });
  }

  res.status(200).json({ received: true });
}
