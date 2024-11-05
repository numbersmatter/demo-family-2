import { redirect } from "@remix-run/node";
import foodpantryDb from "~/lib/food-pantry-db";

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

  const reservationUserId = reservationDoc.userId;

  if (reservationUserId !== userId) {
    throw redirect("/home");
  }
  const eventDoc = await foodpantryDb.events().read({ eventId: reservationDoc.eventId });

  if (!eventDoc) {
    throw redirect("/home");
  }

  return { language, reservation: reservationDoc, event: eventDoc };
};

export { getPageData };
