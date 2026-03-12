import { SignUp } from "@clerk/nextjs";

export default function VerifyEmailAddress() {
  return (
    <div style={{ minHeight: "100vh", background: "#020a02", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="https://www.psiop.io" />
    </div>
  );
}
