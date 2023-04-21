import Layout from "@/components/layout";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <Layout title="Sign Up">
    <div className="grid place-content-center h-screen ">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  </Layout>
);
export default SignUpPage;
