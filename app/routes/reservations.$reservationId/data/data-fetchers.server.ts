import { redirect } from "@remix-run/node";
import foodpantryDb from "~/lib/food-pantry-db";
import { convertTo12Hour } from "~/lib/utils";

const getPageData = async ({
  userId,
  reservationId,
}: {
  userId: string;
  reservationId: string;
}) => {
  const userProfileDoc = await foodpantryDb.users().read({ id: userId });

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const language = userProfileDoc.language;

  const reservationDoc = await foodpantryDb.reservations().read(reservationId);
  if (!reservationDoc) {
    throw redirect("/home");
  }

  const docTime = reservationDoc.time.toString();

  const hour = docTime.substring(0, 2);
  const minute = docTime.substring(2, 4);

  const timeSlot = hour+":"+minute;

  const time_slot = convertTo12Hour(timeSlot);


  const reservation = {
    ...reservationDoc,
    time_slot,
  }

  const reservationUserId = reservationDoc.userId;

  if (reservationUserId !== userId) {
    throw redirect("/home");
  }
  const eventDoc = await foodpantryDb.events().read({ eventId: reservationDoc.eventId });

  if (!eventDoc) {
    throw redirect("/home");
  }

  return { language, reservation, event: eventDoc };
};

export { getPageData };
