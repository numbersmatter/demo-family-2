import { Form, useLoaderData, Link } from "@remix-run/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "~/components/ui/card";
import { loader } from "../route";
import { Button } from "~/components/ui/button";
import { AddressSchema, AddStudentSchema } from "../data/schemas";




export default function SubmitCard() {
  const {
    language,
    address,
    students,
    redirectLinks,
    applied
  } = useLoaderData<typeof loader>();


  const english = {
    title: "Submit",
    fixStudents: "Fix Students",
    fixAddress: "Fix Address",
    description: "Submit your application.",
    button: "Submit",
  }
  const spanish = {
    title: "Enviar",
    fixStudents: "Ir a Estudiantes",
    fixAddress: "Ir a Dirección",
    description: "Envíe su solicitud.",
    button: "Enviar",
  }

  const addressCheck = AddressSchema.safeParse(address);
  const studentData = students[0] ?? {};
  const studentsCheck = AddStudentSchema.safeParse(studentData);

  const success = addressCheck.success && studentsCheck.success;


  const lang = language === "es" ? spanish : english;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {applied ? "Application Submitted" : lang.title}
        </CardTitle>
        <CardDescription>
          {applied ? "Application already submitted." : lang.description}
        </CardDescription>
      </CardHeader>
      <CardContent>

        {!studentsCheck.success &&
          <div className="flex flex-col gap-4">
            <Link to={redirectLinks.students} className="underline">
              <Button>
                {lang.fixStudents}
              </Button>
            </Link>
          </div>
        }

        {!addressCheck.success &&
          <div className="flex flex-col gap-4">
            <Link to={redirectLinks.address} className="underline">
              <Button>
                {lang.fixAddress}
              </Button>
            </Link>
          </div>
        }


        {
          success && !applied &&
          <Form method="post" >
            <input type="hidden" name="intent" value="submitApplication" />
            <Button type="submit">
              Submit
            </Button>
          </Form>
        }

        {
          applied &&
          <div className="text-center">

            <Link to={"/status"} className="underline">
              <Button>
                View Status
              </Button>
            </Link>
          </div>
        }

      </CardContent>
    </Card>
  )
}

