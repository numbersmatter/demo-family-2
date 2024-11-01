import { parseWithZod } from "@conform-to/zod";
import { AuthStates } from "~/lib/auth/user-auth.server";
import { SetLanguageSchema } from "./schemas";
import { json, redirect } from "@remix-run/node";
import { db } from "~/lib/db/db.server";


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

  const language = submission.value.language;
  const userId = submission.value.userId;
  const email = submission.value.email;

  // check if user has a profile doc
  const userProfileDoc = await db.users().read({ id:userId });

  if (!userProfileDoc) {
    
    const profileData = {
      userId,
      language,
      email,
    };
    await db.users().create(profileData);
    return json({ ...submission.reply(), message: "User profile created." });
  }

  await db
    .users()
    .update({ id: userId, updateData: { language } });
  
  if (authState === "registered") {
    return redirect("/home");
  }
  return redirect("/address");
};

export const mutations = {
  setLanguagePreference,
};
