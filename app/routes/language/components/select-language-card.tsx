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
  const { language } = useLoaderData<typeof loader>();


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

      </CardFooter>

    </Card>
  </div>


}