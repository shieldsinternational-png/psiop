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
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480 }}>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="https://www.psiop.io"
          forceRedirectUrl="https://www.psiop.io"
        />
      </div>
    </div>
  );
}