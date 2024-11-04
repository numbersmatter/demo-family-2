import { checkAuth, requireAuth } from '~/lib/auth/user-auth.server'
import { redirect, LoaderFunctionArgs } from '@remix-run/node';

export const handleAuth = async (args: LoaderFunctionArgs) => {
  const data = await requireAuth(args);

  // users have to be registered to view events
  if(data.authState !== "registered"){
    throw redirect("/register"); 
  }
 

  return {
    ...data,
  };
};