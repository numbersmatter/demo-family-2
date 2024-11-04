import { Timestamp } from "firebase-admin/firestore";
import { Address, Minor, PrimaryContact, Student } from "../common-types";





export type ApplicationStatus =
  | "in-progress"
  | "pending"
  | "accepted"
  | "declined"
  | "error";

interface ApplicationAppDb {
  id: string;
  userId: string;
  semesterId: string;
  status: ApplicationStatus;
  primaryContact:PrimaryContact
  address: Address;
  household_adults: number;
  students: Student[];
  minors: Minor[];
  createdDate: Date;
  updatedDate: Date;
}

interface ApplicationDb
  extends Omit<ApplicationAppDb, "id" | "createdDate" | "updatedDate"> {
  updatedTimestamp: Timestamp;
  createdTimestamp: Timestamp;
}

interface ApplicationCreate  extends Omit<ApplicationAppDb, "id" | "createdDate" | "updatedDate"> {}

export type { ApplicationAppDb, ApplicationDb, ApplicationCreate };
