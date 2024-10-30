import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Link, useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import { Button } from "~/components/ui/button";

export default function StatusCard() {
  const { language, applicationDate, user, applicationStatus } = useLoaderData<typeof loader>();

  const english = {
    title: "Applied",
    description: `Hello ${user.fname ?? "user"}, your application has been submitted. You will receive an email with your application status.`,
    applicationInfo: `Application was submitted on ${applicationDate}`,

  }

  const spanish = {
    title: "Aplicación enviada",
    description: `Hola ${user.fname ?? "usuario"}, tu aplicación ha sido enviada. Recibirás un correo electrónico con el estado de tu aplicación.`,
    applicationInfo: `La aplicación fue enviada el ${applicationDate}`,
  }


  const lang = language === "es" ? spanish : english
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {lang.title}
        </CardTitle>
        <CardDescription>
          {lang.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-8 items-center">
        <div>
          <p className="text-lg text-primary font-medium">
            {lang.applicationInfo}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-6 md:flex-row md:gap-8 ">
        {
          applicationStatus === "accepted" &&
          <Link to={"/home"} className="w-full md:w-auto">
            <Button className="w-full">
              Continue to Home
            </Button>
          </Link>
        }
      </CardFooter>
    </Card>
  )
}