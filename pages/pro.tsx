import { useAuth } from "@clerk/nextjs";
import { NextPage } from "next";

const ProPage: NextPage = ({}) => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div>
      Hello, {userId} your current active session is {sessionId}
    </div>
  );
};

export default ProPage;
