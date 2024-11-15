import { parseWithZod } from "@conform-to/zod";
import { AddressSchema } from "./schemas";
import { json, redirect } from "@remix-run/node";
import { AuthStates } from "~/lib/auth/user-auth.server";
import foodpantryDb from "~/lib/food-pantry-db";
import { Address } from "~/lib/food-pantry-db/common-types";


interface AddressUpdate extends Address {
  userId: string;
}

const addressWrite = async ({
  addressUpdate,
}: {
  addressUpdate: AddressUpdate;
}) => {
  const { userId, ...address } = addressUpdate;

  return await foodpantryDb.users().update({
    id: userId,
    updateData: { address: address },
  });
};

const updateAddress = async ({
  formData,
  authState,
}: {
  formData: FormData;
  authState: AuthStates;
}) => {
  const submission = parseWithZod(formData, { schema: AddressSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  await addressWrite({ addressUpdate: submission.value });

  if (authState === "registered") {
    return redirect("/home");
  }
  return redirect("/students");
};

export const mutations = { updateAddress };
