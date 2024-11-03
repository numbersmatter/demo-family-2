import { LoaderFunctionArgs } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { createClerkClient } from "@clerk/remix/api.server";
import { getServerEnv } from "../env-variables.server";


export const getClerkAuth = async (args: LoaderFunctionArgs) => {
  const clerkAuth = await await getAuth(args);
  const { CLERK_SECRET_KEY } = getServerEnv();
  const secretKey = CLERK_SECRET_KEY;

  if(!clerkAuth.userId){
    return {
      userId: null,
      email: null,
    }
  }


  const user = await createClerkClient({ secretKey }).users.getUser(
    clerkAuth.userId
  );

  //  clerk prefixs userId with "user_"
  const userId = clerkAuth.userId.split("_",2)[1];

  const userEmail = user.primaryEmailAddress?.emailAddress as string;
  const userPhone = user.primaryPhoneNumber?.phoneNumber as string;
  const lname = user.lastName as string;
  const fname = user.firstName as string;

  return {
    userId,
    email: userEmail,
    phone: userPhone,
    fname,
    lname,
  };

}