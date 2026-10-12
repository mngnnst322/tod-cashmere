import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <section className="section">
      <div className="container clerk-page">
        <SignUp />
      </div>
    </section>
  );
}
