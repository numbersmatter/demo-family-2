import { redirect } from "@remix-run/node";
import { db } from "~/lib/db/db.server";

const getPageData = async ({ userId }: { userId: string }) => {
  const userProfileDoc = await db.users().read({ id: userId });

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const language = userProfileDoc.language;

  const eventDocs = await db
    .events()
    .listByStages({ stages: ["open-for-requests", "open-for-pickups"] });
  const openEventsDocs = eventDocs.map((eventDoc) => {
    const timeSlots = [
      { id: "100", label: "1:00 PM" },
      { id: "200", label: "2:00 PM" },
      { id: "300", label: "3:00 PM" },
      { id: "400", label: "4:00 PM" },
      { id: "500", label: "5:00 PM" },
    ];
    return {
      ...eventDoc,
      timeSlots,
    };
  });

  const reservationsDocs = await db.reservations().checkUserReservations({
    userId,
    eventIdArray: openEventsDocs.map((event) => event.id),
  });
  const reservations = reservationsDocs.map((reservationDoc) => {
    const event = openEventsDocs.find((eventDoc) => {
      return eventDoc.id === reservationDoc.eventId;
    });
    if (event === undefined) {
      throw new Error("Event not found");
    }
    return {
      eventName: event.name,
      id: reservationDoc.id,
      date: event.eventDate.toLocaleDateString(),
      eventId: reservationDoc.eventId,
      status: reservationDoc.status,
      time: reservationDoc.time,
      confirm: reservationDoc.confirm,
    };
  });

  const openEvents = openEventsDocs
    .filter((eventDoc) => eventDoc.stage === "open-for-requests")
    .filter((eventDoc) => {
      if (!reservations) {
        return true;
      }
      const reservation = reservations.find((reservation) => {
        return reservation.eventId === eventDoc.id;
      });
      return !reservation;
    });

  return { language, openEvents, reservations };
};

export { getPageData };

