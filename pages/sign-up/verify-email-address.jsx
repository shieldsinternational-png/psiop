import { SignUp } from "@clerk/nextjs";

export default function VerifyEmailAddress() {
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
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 20, fontWeight: 900, color: "#f0c040", letterSpacing: "0.2em", marginBottom: 6 }}>
            STARGATE
          </div>
          <div style={{ height: 1, background: "linear-gradient(to right, transparent, #f0c040, transparent)", marginBottom: 16 }} />
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#4ade80", opacity: 0.6, letterSpacing: "0.2em" }}>
            VERIFY VIEWER IDENTITY
          </div>
        </div>

        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="https://www.psiop.io"
          forceRedirectUrl="https://www.psiop.io"
        />

        <div style={{ textAlign: "center", marginTop: 24, fontFamily: "'Courier New', monospace", fontSize: 10, color: "#4ade80", opacity: 0.3, letterSpacing: "0.15em" }}>
          STARGATE — REMOTE VIEWING TRAINING PLATFORM
        </div>
      </div>
    </div>
  );
}
