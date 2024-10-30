import { Link, useFetcher, useLoaderData, useNavigate, useRouteLoaderData } from "@remix-run/react"
import { EllipsisVerticalIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu"
import { loader } from "../route"
import { AddStudentDialog } from "./add-student-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";



type Student = {
  fname: string
  lname: string
  school: "tps" | "lde" | "tms" | "ths"
  id: string
}

type Lang = {
  add: string
  edit: string
  remove: string
}



export function StudentsCard() {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const english = {
    title: "Students",
    description: "Enter Students",
    button: "Continue",
    studentRequired: "This program requires at least one student to be enrolled in Thomasville City Schools. Please add a student.",
  }

  const spanish = {
    title: "Estudiantes",
    description: "Ingrese estudiantes",
    button: "Continuar",
    studentRequired: "Este programa requiere al menos un estudiante inscripto en escuelas de Thomasville. Por favor agregue un estudiante.",
  }

  const lang = loaderData.language === "es" ? spanish : english

  const noStudents = loaderData.students.length < 1

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
        {
          noStudents && <p className="text-sm text-red-500">
            {lang.studentRequired}
          </p>}
        <ContentStudents />
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-4 md:flex-row md:gap-8 ">
        <AddStudentDialog />
        <Button
          variant="default"
          className="w-full md:w-auto"
          disabled={noStudents}
          onClick={() => navigate("/minors")}
        >
          {lang.button}
        </Button>
      </CardFooter>
    </Card>

  )
}

function ContentStudents() {
  const { students, language } = useLoaderData<typeof loader>()




  const english = {
    add: "Add Student",
    edit: "Edit",
    remove: "Remove",
  }

  const spanish = {
    add: "Agregar estudiante",
    edit: "Editar",
    remove: "Eliminar",
  }

  const lang = language === "es" ? spanish : english


  return (
    <ul className="divide-y divide-gray-100">
      {students.map((student: Student) => (
        <StudentRowCard key={student.id} student={student} lang={lang} />
      )
      )}
    </ul>
  )
}




function StudentRowCard({ student, lang }: {
  student: Student,
  lang: Lang
}) {
  const fetcher = useFetcher();

  const handleRemove = async () => {
    return fetcher.submit({ intent: "removeStudent", studentId: student.id }, { method: "post" });
  }


  return <li key={student.id} className="flex justify-between gap-x-6 py-5">
    <div className="flex min-w-0 gap-x-4">
      <div className="h-12 w-12 pt-3 flex place-content-center flex-none rounded-full bg-gray-50">
        {student.fname.charAt(0)}
      </div>
      <div className="min-w-0 flex-auto">
        <p className="text-sm font-semibold leading-6 text-gray-900">
          {student.fname} {student.lname}
        </p>
        <p className="mt-1 flex text-xs leading-5 text-gray-500">

        </p>
      </div>
    </div>
    <div className="flex shrink-0 items-center gap-x-6">
      <div className="hidden sm:flex sm:flex-col sm:items-end">
        <p className="text-sm leading-6 text-gray-900">{student.school}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">
          School: {student.school}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
          <span className="sr-only">
            {lang.edit}
          </span>
          <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
        >
          <DropdownMenuLabel>

          </DropdownMenuLabel>
          {/* <DropdownMenuItem>{lang.edit}</DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleRemove}>{lang.remove}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </li>
}

