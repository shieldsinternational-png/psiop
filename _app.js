import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: "#4ade80",
          colorBackground: "#020a02",
          colorText: "#4ade80",
          colorTextSecondary: "#4ade80",
          colorInputBackground: "rgba(0,15,0,0.8)",
          colorInputText: "#4ade80",
          borderRadius: "2px",
          fontFamily: "'Courier New', monospace",
        },
        elements: {
          card: {
            background: "#020a02",
            border: "1px solid #1a3a1a",
            boxShadow: "0 0 40px rgba(74,222,128,0.1)",
          },
          headerTitle: {
            color: "#f0c040",
            fontFamily: "Georgia, serif",
            letterSpacing: "0.1em",
          },
          headerSubtitle: {
            color: "#4ade80",
            opacity: 0.7,
          },
          formButtonPrimary: {
            background: "rgba(0,60,0,0.9)",
            border: "1px solid #4ade80",
            color: "#4ade80",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          },
          footerActionLink: {
            color: "#f0c040",
          },
          identityPreviewText: {
            color: "#4ade80",
          },
          formFieldInput: {
            background: "rgba(0,15,0,0.8)",
            border: "1px solid #1a3a1a",
            color: "#4ade80",
            fontFamily: "'Courier New', monospace",
          },
          formFieldLabel: {
            color: "#4ade80",
            fontFamily: "'Courier New', monospace",
            fontSize: "11px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          },
          dividerLine: {
            background: "#1a3a1a",
          },
          dividerText: {
            color: "#4ade80",
            opacity: 0.4,
          },
          socialButtonsBlockButton: {
            background: "rgba(0,15,0,0.6)",
            border: "1px solid #1a3a1a",
            color: "#4ade80",
          },
        },
      }}
    >
      <Component {...pageProps} />
      <Analytics />
    </ClerkProvider>
  );
}
