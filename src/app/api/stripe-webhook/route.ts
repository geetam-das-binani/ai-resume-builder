import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";

import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET as string
    );

    console.log(`received event: ${event.type}`, event.data.object);

    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionCreatedOrUpdated(event.data.object.id);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }

    return new Response("Event Received", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    const userId = session.metadata?.userId;
    if (!userId) throw new Error("User Id not found in session");

    (await clerkClient()).users.updateUserMetadata(userId, {
      privateMetadata: {
        stripeCustomerId: session.customer as string,
      },
    });
  } catch (error) {}
}
async function handleSubscriptionCreatedOrUpdated(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (
      subscription.status === "active" ||
      subscription.status === "trialing" ||
      subscription.status === "past_due"
    ) {
      await prisma.userSubscription.upsert({
        where: {
          userId: subscription.metadata.userId as string,
        },
        create: {
          userId: subscription.metadata.userId as string,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer as string,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
        update: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
          stripeCancelAtPeriodEnd: subscription.cancel_at_period_end,
        },
      });
    } else {
      await prisma.userSubscription.deleteMany({
        where: {
          stripeCustomerId: subscription.customer as string,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error handling subscription created or updated");
  }
}
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    await prisma.userSubscription.deleteMany({
      where: {
        stripeCustomerId: subscription.customer as string,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error handling subscription deleted");
  }
}
