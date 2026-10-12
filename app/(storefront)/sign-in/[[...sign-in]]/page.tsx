import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="section">
      <div className="container clerk-page">
        <SignIn />
      </div>
    </section>
  );
}
