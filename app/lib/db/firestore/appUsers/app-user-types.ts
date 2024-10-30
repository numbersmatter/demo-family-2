import { Timestamp } from "firebase-admin/firestore";
export interface Student {
  id: string;
  fname: string;
  lname: string;
  school: "tps" | "lde" | "tms" | "ths";
}

export interface StudentCreate {
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

export interface MinorCreate {
  fname: string;
  lname: string;
  birthyear: number;
}

export interface AppUserAppModel {
  id: string;
  email: string;
  createdDate: Date;
  updatedDate: Date;
  language: "en" | "es";
  address: {
    street: string;
    unit: string;
    city: string;
    state: string;
    zip: string;
  };
  household_adults: number;
  minors: Minor[];
  students: Student[];
}

export interface Address {
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
}

export interface AppUserDbModel {
  email: string;
  createdDate: Timestamp;
  updatedDate: Timestamp;
  language: "en" | "es";
  address: Address;
  household_adults: number;
  minors: Minor[];
  students: Student[];
}

export interface AppUserCreate {
  language: "en" | "es";
  email: string;
  userId: string;
}
