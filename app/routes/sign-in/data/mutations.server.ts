import {
  signInWithEmailAndPassword,
  signInWithToken,
} from "~/lib/firebase/auth/auth.server";
import { EmailPasswordSchema } from "./schemas";
import { parseWithZod } from "@conform-to/zod";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession } from "~/lib/auth/sessions.server";

const attemptSignIn = async ({
  cookie,
  formData,
}: {
  cookie: string | null;
  formData: FormData;
}) => {
  let sessionCookie;
  const idToken = formData.get("idToken");
  try {
    if (typeof idToken === "string") {
      sessionCookie = await signInWithToken(idToken);
    } else {
      const submission = parseWithZod(formData, {
        schema: EmailPasswordSchema,
      });
      if (submission.status !== "success") {
        return json(submission.reply(), { status: 400 });
      }
      const { idToken } = await signInWithEmailAndPassword({
        email: submission.value.email,
        password: submission.value.password,
      });
      sessionCookie = await signInWithToken(idToken);
    }

    const session = await getSession(cookie);
    session.set("session", sessionCookie);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return json({ error: String(error) }, { status: 401 });
  }
};
export const mutations = { attemptSignIn };
