import { Link, useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { loader } from "../route";
import { AddStudentSchema } from "../data/schemas";
import { Button } from "~/components/ui/button";




export default function StudentCheckCard() {
  const { language, students, redirectLinks } = useLoaderData<typeof loader>();

  const english = {
    title: "Students",
    description: "Enter the students enrolled in  Thomasville City Schools.",
    button: "Enter Students",
    successTitle: "Students",
    failureTitle: "You must have at least one student enrolled in Thomasville City Schools.",
  }


  const spanish = {
    title: "Estudiantes",
    description: "Ingrese los estudiantes inscriptos en la Escuela de Thomasville.",
    successTitle: "Estudiantes",
    failureTitle: "Debe tener al menos un estudiante inscripto en la Escuela de Thomasville.",
    button: "Ingrese Estudiantes",
  }

  const lang = language === "es" ? spanish : english;

  const studentData = students[0] ?? {}
  const studentsCheck = AddStudentSchema.safeParse(studentData);
  const success = studentsCheck.success;

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
          success ?
            students.map((student) => {

              return (
                <div key={student.id} className="flex flex-col gap-2">
                  <div className="text-lg font-bold">
                    {student.fname} {student.lname}
                  </div>
                </div>
              )
            })
            :
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-lg font-bold">
                  {lang.failureTitle}
                </div>
                <div className="text-lg">
                  <Link to={redirectLinks.students} className="underline">
                    <Button>
                      {lang.button}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
        }
      </CardContent>
    </Card>
  )
}