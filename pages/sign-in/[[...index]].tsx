import Layout from "@/components/layout";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <Layout title="Sign In">
    <div className="grid place-content-center h-screen ">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  </Layout>
);
export default SignInPage;
