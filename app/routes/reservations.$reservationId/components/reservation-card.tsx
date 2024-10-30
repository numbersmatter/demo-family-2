import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Link, useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import { Button } from "~/components/ui/button";

export default function ReservationCard() {
  const { reservation, language, event } = useLoaderData<typeof loader>();

  const eventDate = new Date(event.eventDate).toLocaleDateString();

  const english = {
    title: `Reservation for ${event.name} `,
    description: eventDate,

  }

  const spanish = {
    title: "Reserva",
    description: eventDate,
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
        <div className="grid grid-cols-1 gap-4 items-center mx-auto">
          <h5>
            Confirmation Code
          </h5>
          <p className="text-3xl text-accent-foreground font-extrabold">
            {reservation.confirm}
          </p>
          <h5>
            Status
          </h5>
          <p className="text-lg text-accent-foreground font-extrabold">
            {reservation.status}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-6 md:flex-row md:gap-8 ">

        <Link to={"/home"} className="w-full md:w-auto">
          Back
        </Link>
      </CardFooter>
    </Card>
  )
}