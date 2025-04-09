"use server";
import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

const createCheckoutSession = async (priceId: string) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const stripeCustomerId = user.privateMetadata.stripeCustomerId as
      | string
      | undefined;
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
      cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
      customer: stripeCustomerId,
      customer_email: stripeCustomerId
        ? undefined
        : user.emailAddresses[0].emailAddress,
      metadata: {
        userId: user.id,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },

      custom_text: {
        terms_of_service_acceptance: {
          message: `I have read AI Resume Builder's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them`,
        },
      },
      consent_collection: {
        terms_of_service: "required",
      },
      billing_address_collection: "required",
    });
    if (!session) throw new Error("Failed to create checkout session");
    return session.url;
  } catch (error) {}
};
const createCreatePortalSession = async () => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Unauthorized");

    const stripeCustomerId = user.privateMetadata.stripeCustomerId as
      | string
      | undefined;

    if (!stripeCustomerId) throw new Error("No stripe customer id found");

    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    });

    if (!session?.url) throw new Error("Failed to create portal session");

    return session.url;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create portal session");
  }
};
export { createCheckoutSession, createCreatePortalSession };
