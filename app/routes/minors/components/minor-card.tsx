import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "~/components/ui/card";
import { action, loader } from "../route";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { AddMinorDialog } from "./add-minor-dialog";
import { Minor } from "~/lib/firebase/firestore/appUsers/app-user-types";


export default function MinorsCard() {
  const { language } = useLoaderData<typeof loader>();

  const english = {
    title: "Minors not enrolled in school",
    description: "Enter ",
    button: "Continue",
  }

  const spanish = {
    title: "Menores no inscriptos en la escuela",
    description: "Ingrese Menores",
    button: "Continuar",
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
      <CardContent>
        <ContentMinors />
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-4 md:flex-row md:gap-8 ">
        <AddMinorDialog />
        <Link to="/adults" className="w-full md:w-auto">
          <Button variant="default" className="w-full md:w-auto">
            {lang.button}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}


function ContentMinors() {
  const { minors } = useLoaderData<typeof loader>()
  const fetcher = useFetcher<typeof action>();


  const removeStudent = async (id: string) => {

    const formInput = new FormData();
    formInput.append("intent", "removeMinor");
    formInput.append("minorId", id);

    const result = await fetcher.submit(formInput, { method: "post" });
    return result;
  }


  return (
    <ul className="divide-y divide-gray-100">
      {minors.map((minor: Minor) => (
        <li key={minor.id} className="flex justify-between gap-x-6 py-5">
          <div className="flex min-w-0 gap-x-4">
            <div className="h-12 w-12 pt-3 flex place-content-center flex-none rounded-full bg-gray-50">
              {minor.fname.charAt(0)}
            </div>
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {minor.fname} {minor.lname}
              </p>
              <p className="mt-1 flex text-xs leading-5 text-gray-500">
                {minor.birthyear}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-6">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
            </div>
            <DropdownMenu  >
              <DropdownMenuTrigger className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <DropdownMenuLabel>
                  Options
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => removeStudent(minor.id)}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </li>
      ))}
    </ul>
  )
}
