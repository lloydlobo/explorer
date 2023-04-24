import Layout from "@/components/layout";
import { cn } from "@/lib/utils";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <>
    <style jsx global>{`
      main {
        display: grid;
        justify-content: center;
        align-items: center;
      }
    `}</style>
    <Layout title="Sign In">
      <div className="py-12">
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </div>
    </Layout>
  </>
);
export default SignInPage;
