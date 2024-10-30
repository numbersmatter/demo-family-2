import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { loader } from "../route";



export default function SelectLanguageCard() {
  const { userProfile } = useLoaderData<typeof loader>();

  const hasProfile = userProfile !== null;
  const language = userProfile?.language || "en";

  return <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
    <Card className="">
      <CardHeader>
        <CardTitle>
          Welcome to the Pantry App
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8 items-center">
        <Form method="post" className="mx-auto">
          <input type="hidden" name="intent" value="setLanguage" />
          <Button variant={"default"} name="language" value="en">
            Continue in English
          </Button>
        </Form>
        <Form method="post" className="mx-auto">
          <input type="hidden" name="intent" value="setLanguage" />
          <Button name="language" value="es">
            Continuar en español
          </Button>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link to="/onboarding">
          <Button variant={"default"} className="bg-blue-500 text-white">
            <span className="text-3xl  ">
              {language === "en" ? "Continue" : "Continuar"}
            </span>
          </Button>
        </Link>
      </CardFooter>

    </Card>
  </div>


}