import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string | undefined> = {
  premium: process.env.STRIPE_PRICE_PREMIUM,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL,
};

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json(
      { error: "Stripe is not configured on the server." },
      { status: 500 }
    );
  }

  const { planId } = await request.json();
  const priceId = PRICE_IDS[planId];

  if (!priceId) {
    return Response.json(
      { error: `No Stripe price configured for plan "${planId}".` },
      { status: 400 }
    );
  }

  const origin = request.headers.get("origin") ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?checkout=success`,
    cancel_url: `${origin}/pricing`,
  });

  return Response.json({ url: session.url });
}
