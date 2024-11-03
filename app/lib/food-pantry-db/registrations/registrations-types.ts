import { Timestamp } from "firebase-admin/firestore";

interface PrimaryContact {
  fname: string;
  lname: string;
  email: string;
  phone: string;
}

interface Student {
  id: string;
  fname: string;
  lname: string;
  school: "tps" | "lde" | "tms" | "ths";
}
interface Minor {
  id: string;
  fname: string;
  lname: string;
  birthyear: number;
}

interface Registration {
  id: string;
  userId: string;
  semesterId: string;
  applicationId: string;
  status: "registered" | "error" | "removed";
  primaryContact: PrimaryContact;
  household_adults: number;
  students: Student[];
  minors: Minor[];
  createdDate: Date;
  updatedDate: Date;
}

interface RegistrationDb extends Omit<Registration, "id" | "createdDate" | "updatedDate"> {
  updatedDate: Timestamp;
  createdDate: Timestamp;
}

interface RegistrationCreate
  extends Omit<RegistrationDb, "createdDate" | "updatedDate"> {}

export type {
  Registration,
  RegistrationDb,
  RegistrationCreate,
  Student,
  Minor,
};
