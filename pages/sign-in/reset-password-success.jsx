import { SignIn } from "@clerk/nextjs";

export default function ResetPasswordSuccess() {
  return (
    <div style={{ minHeight: "100vh", background: "#020a02", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <SignIn routing="path" path="/sign-in" fallbackRedirectUrl="https://www.psiop.io" />
    </div>
  );
}
