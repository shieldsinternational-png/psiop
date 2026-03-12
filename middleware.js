import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/monitor(.*)",
  "/api/create-checkout-session(.*)",
  "/api/stripe-webhook(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect nothing — auth is handled at the component level
  // All routes including API routes are public
});

export const config = {
  matcher: [
    "/((?!_next|api|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
