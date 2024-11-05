import { useLoaderData, Link } from "@remix-run/react"
import { CarIcon, } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { loader } from "../route"
import { RequestDialog } from "./request-dialog"
import { Button } from "~/components/ui/button"
// import { useUser } from "@clerk/remix"

interface TimeSlots {
  id: string;
  time: string;
}
interface FoodOpportunity {
  id: string;
  name: string;
  status: string;
  code: string;
  totalSales: number;
  date: string;
  applied: boolean;
  timeSlots: TimeSlots[];
}


export default function OpenEvents() {
  const { openEvents } = useLoaderData<typeof loader>()
  // const totalOpportunities = opportunities.length;

  const events = openEvents.map((event) => {
    return {
      ...event,
      eventDate: new Date(event.eventDate).toLocaleDateString(),
    }
  })



  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 ">
      {/* Content goes here */}

      <Card className={""}>
        <CardHeader>
          <CardTitle>Open for Reservations</CardTitle>
          <CardDescription>
            Reserve your spot for an event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Icon</span>
                </TableHead> */}
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Tracking Code</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => {
                return (
                  <TableRow key={event.id}>
                    {/* <TableCell className="hidden sm:table-cell">
                      <CarIcon
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        width="64"
                      />
                    </TableCell> */}
                    <TableCell className="font-medium">
                      {event.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.eventDate}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link to={`/events/${event.id}`} className="text-primary">
                        <Button variant="outline">
                          Request
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
        {/* <pre>{JSON.stringify(events, null, 2)}</pre> */}
        <CardFooter>
          <div className="text-xs text-muted-foreground">

          </div>
        </CardFooter>
      </Card>

    </div>
  )
}
