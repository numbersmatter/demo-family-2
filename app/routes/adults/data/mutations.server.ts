import { parseWithZod } from "@conform-to/zod";
import { SetAdultsSchema } from "./schemas";
import { json, redirect } from "@remix-run/node";
import foodpantryDb from "~/lib/food-pantry-db";

const setAdults = async ({ formData }: { formData: FormData }) => {
  const userId = formData.get("userId") as string;
  const submission = parseWithZod(formData, { schema: SetAdultsSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  const { adults } = submission.value;

  await foodpantryDb
    .users()
    .update({ id: userId, updateData: { household_adults: adults } });

  return redirect("/register")
};

export const mutations = { setAdults };
