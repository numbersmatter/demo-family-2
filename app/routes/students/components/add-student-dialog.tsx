import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useEffect, useState } from "react";
import { useForm, getFormProps, getInputProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { action, loader } from "../route";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { AddStudentSchema } from "../data/schemas";

export function AddStudentDialog() {
  const { language } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const params = useParams();
  const reg_id = params.reg_id ?? "no-id";
  const [open, setOpen] = useState(false);
  const [school, setSchool] = useState("");
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult: fetcher.data,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AddStudentSchema });
    },
    defaultValue: {
      fname: "",
      lname: "",
      school: "",
    },

    shouldRevalidate: 'onBlur',
  })

  const isFetching = fetcher.state !== "idle";
  const success = fetcher.data?.status === "success" ? true : false;

  useEffect(() => {
    if (success && !isFetching) {
      setOpen(false);
    }
  }, [success, isFetching]);



  // const errors = fetcher.data?.errors ?? {}

  const english = {
    button: "Add Student",
    title: "Student Information",
    description: "Add a student to family.",
    fname: "First Name",
    lname: "Last Name",
    school: "School",
    schoolSelect: "Select School",
    submit: "Submit",
  }

  const spanish = {
    button: "Agregar Estudiante",
    title: "Información del Estudiante",
    description: "Agregar un estudiante a la familia.",
    fname: "Nombre",
    lname: "Apellido",
    school: "Escuela",
    schoolSelect: "Escuela",
    submit: "Enviar",
  }

  const lang = language === "es" ? spanish : english;


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full md:w-auto">
          {lang.button}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lang.title}</DialogTitle>
          <DialogDescription>
            {lang.description}
          </DialogDescription>
        </DialogHeader>
        <fetcher.Form method="post"
          {...getFormProps(form)}
        >

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={fields.fname.id} className="text-right">
                {lang.fname}
              </Label>
              <Input
                defaultValue=""
                className="col-span-3"
                {...getInputProps(fields.fname, { type: "text" })}
              />
              <div className="text-red-500 col-start-2 col-span-3">
                {fields.fname.errors}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={fields.lname.id} className="text-right">
                {lang.lname}
              </Label>
              <Input
                defaultValue=""
                className="col-span-3"
                {...getInputProps(fields.lname, { type: "text" })}
              />
              <div className="text-red-500 col-start-2 col-span-3">
                {fields.lname.errors}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={"school"} className="text-right">
                {lang.school}
              </Label>
              <div className="col-span-3">
                <RadioGroup defaultValue="comfortable" value={school} onValueChange={setSchool}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tps" id="tps" />
                    <Label htmlFor="tps">Thomasville Primary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lde" id="lde" />
                    <Label htmlFor="lde">Liberty Drive Elementary</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="tms" id="tms" />
                    <Label htmlFor="tms">Thomasville Middle</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ths" id="ths" />
                    <Label htmlFor="tms">Thomasville High</Label>
                  </div>
                </RadioGroup>
                <input type="hidden" name="school" value={school} readOnly />
                {/* <RadioGroup defaultValue="comfortable" value={school} onValueChange={setSchool}>
                {/* <Select
                  {...getSelectProps(fields.school)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={lang.schoolSelect} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Schools</SelectLabel>
                      <SelectItem disabled value="school" className="text-sm">
                        {lang.schoolSelect}
                      </SelectItem>
                      <SelectItem value="tps">
                        Thomasville Primary
                      </SelectItem>
                      <SelectItem value="lde">
                        Liberty Drive Elementary
                      </SelectItem>
                      <SelectItem value="tms">
                        Thomasville Middle
                      </SelectItem>
                      <SelectItem value="ths">
                        Thomasville High
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select> */}
              </div>
              <div className="text-red-500 col-span-3 col-start-2">
                {fields.school.errors}
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button name="intent" value="addStudent" type="submit">
              {lang.submit}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}