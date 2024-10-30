import { Timestamp } from "firebase-admin/firestore";


export interface Student {
  id: string;
  fname: string;
  lname: string;
  school: "tps" | "lde" | "tms" | "ths";
}

export interface Minor {
  id: string;
  fname: string;
  lname: string;
  birthyear: number;
}

export type ApplicationStatus =
  | "in-progress"
  | "pending"
  | "accepted"
  | "declined"
  | "error";

interface Application {
  id: string;
  userId: string;
  semesterId: string;
  status: ApplicationStatus;
  primaryContact: {
    fname: string;
    lname: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    unit: string;
    city: string;
    state: string;
    zip: string;
  };
  household_adults: number;
  students: Student[];
  minors: Minor[];
  createdDate: Date;
  updatedDate: Date;
}

interface ApplicationDb
  extends Omit<Application, "id" | "createdDate" | "updatedDate"> {
  updatedDate: Timestamp;
  createdDate: Timestamp;
}

export type { Application, ApplicationDb };
