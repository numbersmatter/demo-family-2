import { parseWithZod } from "@conform-to/zod";
import { SetAdultsSchema } from "./schemas";
import { json } from "@remix-run/node";
import { db } from "~/lib/db/db.server";

const setAdults = async ({ formData }: { formData: FormData }) => {
  const userId = formData.get("userId") as string;
  const submission = parseWithZod(formData, { schema: SetAdultsSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  const { adults } = submission.value;

  await db
    .users()
    .update({ id: userId, updateData: { household_adults: adults } });

  return json({
    ...submission.reply(),
    message: "Number of Adults updated.",
  });
};

export const mutations = { setAdults };
