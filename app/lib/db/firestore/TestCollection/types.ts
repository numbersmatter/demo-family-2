import { Timestamp } from "firebase-admin/firestore";

export type TestDocApp = {
  id: string;
  name: string;
  test_text: string;
};

export type TestDocDbModel = {
  id: string;
  name: string;
  test_text: string;
};

export type TestDocCreate = {
  test_text: string;
  name: string;
};
