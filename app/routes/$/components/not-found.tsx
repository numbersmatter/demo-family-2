import { Link } from "@remix-run/react";
import { Button } from "~/components/ui/button";


export default function NotFound() {

  return (
    <div className="flex flex-col py-4 items-center justify-center gap-16">
      <h1>
        404 - Page Not Found
      </h1>
      <p>
        The page you are looking for does not exist.
      </p>

      <Link to="/">
        <Button variant={"link"} >
          Go home
        </Button>
      </Link>
    </div>
  )

}