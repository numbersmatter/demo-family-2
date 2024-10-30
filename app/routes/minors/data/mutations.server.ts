import { parseWithZod } from "@conform-to/zod";
import { AddMinorSchema, RemoveMinorSchema } from "./schemas";
import { json } from "@remix-run/node";
import { db } from "~/lib/db/db.server";

const addMinor = async ({ formData }: { formData: FormData }) => {
  const userId = formData.get("userId") as string;
  const submission = parseWithZod(formData, { schema: AddMinorSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  const { fname, lname, birthyear } = submission.value;
  const minor = {
    fname,
    lname,
    birthyear,
  };

  await db.users().addMinor({ userId, minor });

  return json({
    ...submission.reply(),
    message: "Minor added.",
  });
};

const removeMinor = async ({ formData }: { formData: FormData }) => {
  const userId = formData.get("userId") as string;
  const submission = parseWithZod(formData, { schema: RemoveMinorSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  const { minorId } = submission.value;

  await db.users().removeMinor({ userId, minorId });

  return json({
    ...submission.reply(),
    message: "Minor removed.",
  });
};

export const mutations = {
  addMinor,
  removeMinor,
};
