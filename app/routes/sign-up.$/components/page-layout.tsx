import { SignUp } from "@clerk/remix";
import { Link } from "@remix-run/react";

export default function PageLayout() {
  return (
    <div className="grid min-h-screen w-full">
      <div className="flex flex-col place-content-center">

        <main className="flex flex-1 flex-col content-center items-center  gap-4 p-4 lg:gap-6 lg:p-6">
          <h1 className="text-3xl font-bold">
            New Users Sign Up
          </h1>
          <p>
            If you are already have an account <Link to="/sign-in">
              <span className="text-blue-600 underline hover:text-blue-800">
                Sign-in here!
              </span>
            </Link>
          </p>
          <SignUp />

          {/* <pre>{JSON.stringify(authTry, null, 2)}</pre> */}
        </main>
      </div>
    </div>
  )
}