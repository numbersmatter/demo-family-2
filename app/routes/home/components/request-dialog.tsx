import { Form, useActionData, useFetcher, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { action, loader } from "../route";
import { getFormProps, useForm } from "@conform-to/react";
import { z } from "zod";
import { parseWithZod } from "@conform-to/zod";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { RequestReservationSchema } from "../data/schemas";
// import { useUser } from "@clerk/remix";


const requestSchema = z.object({
  time: z.string(),
});

export function RequestDialog({
  eventId, timeSlots, semesterId
}: {
  timeSlots: { id: string, label: string }[],
  eventId: string,
  semesterId: string
}) {
  const { language } = useLoaderData<typeof loader>();
  const [open, setOpen] = useState(false);
  const lastResult = useActionData<typeof action>();
  const [slot, setSlot] = useState("test");
  // const userInfo = useUser();

  const [form, fields] = useForm({
    // lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RequestReservationSchema });
    }
  });

  const english = {
    button: "Request",
    title: "Request Information",
    description: "Select time slots.",
    timeSlot: "Time Slot",
    submit: "Submit",
  }

  const spanish = {
    button: "Solicitar",
    title: "Información de la Solicitud",
    description: "Seleccionar horarios.",
    timeSlot: "Horario",
    submit: "Enviar",
  }

  const lang = language === "es" ? spanish : english;



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">
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
        <Form method="post" {...getFormProps(form)}>
          <div className="grid gap-4 py-4">
            <Label htmlFor={fields.time.id}>
              {lang.timeSlot}
            </Label>
            <input
              hidden
              id={fields.time.id} name={fields.time.name}
              value={slot}
              readOnly
            />
            <Select value={slot} onValueChange={setSlot}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={lang.timeSlot} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{lang.timeSlot}</SelectLabel>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <input type="hidden" name="eventId" value={eventId} />
            <input type="hidden" name="semesterId" value={semesterId} />
            <Button variant={"default"} name={"intent"} value={"request-reservation"} type="submit">
              {lang.submit}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}