import { Timestamp } from "firebase-admin/firestore";
interface PrimaryContact {
  fname: string;
  lname: string;
  email: string;
  phone: string;
}

export interface ReservationAppModel {
  id: string;
  userId: string;
  createdDate: Date;
  updatedDate: Date;
  eventId: string;
  status: "pending" | "approved" | "declined" | "waitlist";
  time: number;
  confirm: string;
  primaryContact: PrimaryContact;
}

export interface ReservationDbModel {
  id: string;
  createdDate: Timestamp;
  updatedDate: Timestamp;
  eventId: string;
  status: "pending" | "approved" | "declined" | "waitlist";
  confirm: string;
  userId: string;
  primaryContact: PrimaryContact;
  time: number;
}

export interface CreateReservation {
  id: string;
  eventId: string;
  userId: string;
  time: number;
  primaryContact: PrimaryContact;
}
