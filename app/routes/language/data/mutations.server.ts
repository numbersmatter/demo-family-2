import { parseWithZod } from "@conform-to/zod";
import { SetLanguageSchema } from "./schemas";
import { json, redirect } from "@remix-run/node";
import { db } from "~/lib/db/db.server";
import { AuthStates } from "~/lib/business-logic/auth-state.server";

const updateLanguagePreference = async ({
  userId,
  language,
}: {
  userId: string;
  language: string;
}) => {
  return await db
    .users()
    .update({ id: userId, updateData: { language: language } });
};
const createUserProfileWithLanguagePreference = async ({
  userId,
  language,
  email,
}: {
  userId: string;
  language: "en" | "es";
  email: string;
}) => {
  const profileData = {
    userId: userId,
    language: language,
    email: email,
  };
  return await db.users().create(profileData);
};

const setLanguagePreference = async ({
  formData,
  authState,
}: {
  formData: FormData;
  authState: AuthStates;
}) => {
  const submission = parseWithZod(formData, { schema: SetLanguageSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: 400 });
  }

  // check if user has a profile doc
  const userProfileDoc = await db.users().read({ id: submission.value.userId });

  if (!userProfileDoc) {
    const write = await createUserProfileWithLanguagePreference(
      submission.value
    );
    return json({ ...submission.reply(), message: "User profile created." });
  }

  await updateLanguagePreference(submission.value);
  if (authState === "registered") {
    return redirect("/home");
  }
  return redirect("/address");
};

export const mutations = {
  setLanguagePreference,
};
