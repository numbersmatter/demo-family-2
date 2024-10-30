import { useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { action, loader } from "../route";
import { useEffect, useState } from "react";
import { parseWithZod } from "@conform-to/zod";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { AddMinorSchema } from "../data/schemas";

export function AddMinorDialog() {
  const { language } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [open, setOpen] = useState(false);
  const [form, fields] = useForm({
    // Sync the result of last submission
    lastResult: fetcher.data,

    // Reuse the validation logic on the client
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AddMinorSchema });
    },
    defaultValue: {
      fname: "",
      lname: "",
      birthyear: "",
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

  const english = {
    button: "Add Minor",
    title: "Minor Information",
    description: "Add to family.",
    fname: "First Name",
    lname: "Last Name",
    birthyear: "Birth Year",
    submit: "Submit",
  }

  const spanish = {
    button: "Agregar Menor",
    title: "Información del Menor",
    description: "Agregar al familio.",
    fname: "Nombre",
    lname: "Apellido",
    school: "Escuela",
    birthyear: "Año de Nacimiento",
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
        <fetcher.Form method="post" {...getFormProps(form)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fname" className="text-right">
                {lang.fname}
              </Label>
              <Input
                className="col-span-3"
                {...getInputProps(fields.fname, { type: "text" })}
              />
              <div className="text-red-500 col-start-2 col-span-3">
                {fields.fname.errors}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lname" className="text-right">
                {lang.lname}
              </Label>
              <Input
                className="col-span-3"
                {...getInputProps(fields.lname, { type: "text" })}
              />
              <div className="text-red-500 col-start-2 col-span-3">
                {fields.lname.errors}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthyear" className="text-right">
                {lang.birthyear}
              </Label>
              <Input
                className="col-span-3"
                {...getInputProps(fields.birthyear, { type: "number" })}
              />
              <div className="text-red-500 col-start-2 col-span-3">
                {fields.birthyear.errors}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isFetching} variant={"default"} name={"intent"} value={"addMinor"} type="submit">
              {lang.submit}
            </Button>
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  )
}