import { redirect } from "@remix-run/node";
import { db } from "~/lib/db/db.server";

const getPageData = async ({
  userId,
  reservationId,
}: {
  userId: string;
  reservationId: string;
}) => {
  const userProfileDoc = await db.users().read({ id: userId });

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const language = userProfileDoc.language;

  const reservationDoc = await db.reservations().read(reservationId);

  if (!reservationDoc) {
    throw redirect("/home");
  }

  const reservationUserId = reservationDoc.userId;

  if (reservationUserId !== userId) {
    throw redirect("/home");
  }
  const eventDoc = await db.events().read({ eventId: reservationDoc.eventId });

  if (!eventDoc) {
    throw redirect("/home");
  }

  return { language, reservation: reservationDoc, event: eventDoc };
};

export { getPageData };
