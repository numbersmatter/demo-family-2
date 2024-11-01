import { parseWithZod } from "@conform-to/zod";
import { RequestReservationSchema } from "./schemas";
import { json, redirect } from "@remix-run/node";
import { db } from "~/lib/db/db.server";

const requestReservation = async ({
  formData,
  userId,
}: {
  formData: FormData;
  userId: string;
}) => {
  const submission = parseWithZod(formData, {
    schema: RequestReservationSchema,
  });

  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  const registrationDoc = await db
    .registrations()
    .checkRegistration({ userId, semesterId: submission.value.semesterId });

  if (!registrationDoc) {
    throw Error("Registration not found");
  }

  const reservationData = {
    eventId: submission.value.eventId,
    userId,
    fname: registrationDoc.primaryContact.fname,
    lname: registrationDoc.primaryContact.lname,
    email: registrationDoc.primaryContact.email,
    phone: registrationDoc.primaryContact.phone,
    time: submission.value.time,
  };

  await db.reservations().makeReservation(reservationData);

  throw redirect("/home");
};

export const mutations = { requestReservation };

