import { useLoaderData } from "@remix-run/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { loader } from "../route"
import { ColumnDef } from "@tanstack/react-table"
import ReservationsList from "./reservations-list"


// export interface Reservation {
//   id: string;
//   person_id: string;
//   // createdDate: Date;
//   // updatedDate: Date;
//   date: string;
//   eventId: string;
//   status: "pending" | "approved" | "declined" | "waitlist";
//   time: string;
//   confirm: string;
//   person_name: string;
// }

interface ReservationTable {
  eventName: string;
  status: string;
  date: string;
  time: number;
  confirm: string;
  id: string;
}

const reservationColumns: ColumnDef<ReservationTable>[] = [
  {
    accessorKey: "eventName",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return <span>{row.original.date}</span>;
    },
  },
  {
    accessorKey: "time",
    header: "Slot",
  },
  {
    accessorKey: "confirm",
    header: "Code",
  },
]





export default function Reservations() {
  const { reservations } = useLoaderData<typeof loader>()


  return (
    <div className="mx-auto max-w-7xl py-4 sm:px-6 lg:px-8 ">
      {/* Content goes here */}

      <Card className={""}>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
          <CardDescription>
            Here you can see all active and pending reservations.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0" >
          <ReservationsList />
          {/* <DataTable columns={reservationColumns} data={reservations} /> */}
          {/* <pre>{JSON.stringify(events.reservations, null, 2)}</pre> */}
        </CardContent>
        <CardFooter>

        </CardFooter>
      </Card>

    </div>
  )
}
