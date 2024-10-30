import { useLoaderData } from "@remix-run/react"
import { CarIcon } from "lucide-react"
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
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Icon</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Apply or Code</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openEvents.map((event) => {
                return (
                  <TableRow key={event.id}>
                    <TableCell className="hidden sm:table-cell">
                      <CarIcon
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {event.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {event.eventDate}
                    </TableCell>
                    <TableCell>
                      <RequestDialog
                        timeSlots={event.timeSlots}
                        eventId={event.id}
                        semesterId={event.semesterId}
                      />
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
