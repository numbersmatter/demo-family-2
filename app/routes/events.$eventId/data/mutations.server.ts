import { parseWithZod } from "@conform-to/zod";
import { RequestReservationSchema } from "./schemas";
import { json, redirect } from "@remix-run/node";
import foodpantryDb from "~/lib/food-pantry-db";
import { PrimaryContact } from "~/lib/food-pantry-db/common-types";

const requestReservation = async ({
  formData,
  userId,
  primaryContact,
}: {
  formData: FormData;
  userId: string;
  primaryContact: PrimaryContact;
}) => {
  const submission = parseWithZod(formData, {
    schema: RequestReservationSchema,
  });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  //  does a reservation for this event already exist?
  //  if so, redirect to that reservation
  //  if not, create a new reservation

  const existingReservation = await foodpantryDb
    .reservations()
    .checkReservation({ userId, eventId: submission.value.eventId });

  if (existingReservation) {
    throw redirect(`/reservations/${existingReservation.id}`);
  }

  const reservationData = {
    eventId: submission.value.eventId,
    userId,
    fname: primaryContact.fname,
    lname: primaryContact.lname,
    email: primaryContact.email,
    phone: primaryContact.phone,
    time: submission.value.time,
  };

  const newReservationId = await foodpantryDb.reservations()
  .makeReservation(reservationData);


  return redirect(`/reservations/${newReservationId}`);
};

export const mutations = {
  requestReservation,
}
