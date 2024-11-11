import { redirect } from "@remix-run/node";
import foodpantryDb from "~/lib/food-pantry-db";
import { convertTo12Hour } from "~/lib/utils";

const getPageData = async ({ userId }: { userId: string }) => {
  const userProfileDoc = await foodpantryDb.users().read({ id: userId });

  if (!userProfileDoc) {
    throw redirect("/language");
  }

  const language = userProfileDoc.language;


  // Query for events in an open state
  const eventDocs = await foodpantryDb
    .events()
    .listByStages({ stages: ["open-for-requests", "open-for-pickups"] });




  //  Add time slots to each event
  const openEventsDocs = eventDocs.map((eventDoc) => {
    const timeSlots = [
      { id: "1600", label: "4:00 PM" },
      { id: "1630", label: "4:30 PM" },
      { id: "1700", label: "5:00 PM" },
      { id: "1730", label: "5:30 PM" },
    ];
    return {
      ...eventDoc,
      timeSlots,
    };
  });


  // Query for reservations the user has made for events in an open state
  // To do this we need to pass a list of event ids and userId
  const reservationsDocs = await foodpantryDb.reservations().checkUserReservations({
    userId,
    eventIdArray: openEventsDocs.map((event) => event.id),
  });

  // For each reservation we need to add event name and date usind the event id
  const reservations = reservationsDocs.map((reservationDoc) => {
    const event = openEventsDocs.find((eventDoc) => {
      return eventDoc.id === reservationDoc.eventId;
    });
    if (event === undefined) {
      throw new Error("Event not found");
    }

    const docTime = reservationDoc.time.toString();
    const hour = docTime.substring(0, 2);
    const minute = docTime.substring(2, 4);
    const timeSlot = hour+":"+minute;
    const time_slot = convertTo12Hour(timeSlot);



    return {
      eventName: event.name,
      id: reservationDoc.id,
      date: event.eventDate.toLocaleDateString(),
      eventId: reservationDoc.eventId,
      status: reservationDoc.status,
      time: reservationDoc.time,
      confirm: reservationDoc.confirm,
      time_slot,
    };
  });


  // Filter out events that have reservations by the user
  const openEvents = openEventsDocs
    // filter only for events in the open-for-requests stage
    .filter((eventDoc) => eventDoc.stage === "open-for-requests")
    // filter out events that have reservations by the user
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

