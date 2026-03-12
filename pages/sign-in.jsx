import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020a02",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      padding: 24,
    }}>
      {/* Scanlines */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: 900, color: "#f0c040", letterSpacing: "0.2em", marginBottom: 6 }}>
            STARGATE
          </div>
          <div style={{ height: 1, background: "linear-gradient(to right, transparent, #f0c040, transparent)", marginBottom: 16 }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#4ade80", opacity: 0.6, letterSpacing: "0.2em" }}>
            AUTHENTICATE VIEWER IDENTITY
          </div>
        </div>

        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
        />

        <div style={{ textAlign: "center", marginTop: 24, fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", opacity: 0.3, letterSpacing: "0.15em" }}>
          STARGATE — RV TRAINING PLATFORM
        </div>
      </div>
    </div>
  );
}
