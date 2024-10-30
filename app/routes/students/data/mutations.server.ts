import { parseWithZod } from "@conform-to/zod";
import { json } from "@remix-run/node";
import { AddStudentSchema, RemoveStudentSchema } from "./schemas";
import { db } from "~/lib/db/db.server";

const addStudent = async ({ formData }: { formData: FormData }) => {
  const userId = formData.get("userId") as string;
  const submission = parseWithZod(formData, { schema: AddStudentSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  const { fname, lname, school } = submission.value;
  const student = {
    fname,
    lname,
    school,
  };

  await db.users().addStudent({ userId, student });

  return json({
    ...submission.reply(),
    message: "Student added.",
  });
};

const removeStudent = async ({ formData }: { formData: FormData }) => {
  const userId = formData.get("userId") as string;
  const submission = parseWithZod(formData, { schema: RemoveStudentSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  const { studentId } = submission.value;

  await db.users().removeStudent({ userId, studentId });

  return json({
    ...submission.reply(),
    message: "Student removed.",
  });
};

export const mutations = {
  addStudent,
  removeStudent,
};