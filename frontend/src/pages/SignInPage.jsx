import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="flex justify-center items-center h-screen">
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </div>
);

export default SignInPage;
