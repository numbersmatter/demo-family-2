import { json, redirect } from '@remix-run/node';
import foodpantryDb from '~/lib/food-pantry-db';

// get data on the event
const getPageData = async ({
   userId, eventId 
}: {
     userId: string, eventId: string 
}) => {
  const eventDoc = await foodpantryDb.events().read({ eventId })
  if (!eventDoc) {
    throw json(null, { status: 404 , statusText: "Event not found" });
  }

  // check if event is open for requests
  // if not, redirect to home
  if(eventDoc.stage !== "open-for-requests"){
    throw redirect("/home");
  }

  const timeSlots = [
    { id: "1600", label: "4:00 PM" },
    { id: "1630", label: "4:30 PM" },
    { id: "1700", label: "5:00 PM" },
    { id: "1730", label: "5:30 PM" },
  ];

  

  const event ={
    id: eventDoc.id,
    name: eventDoc.name,
    type: eventDoc.type,
    stage: eventDoc.stage,
    eventDate: eventDoc.eventDate,
    semesterId: eventDoc.semesterId,
    timeSlots,
  }


  return { event };
};

export { getPageData };