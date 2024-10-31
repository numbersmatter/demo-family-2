import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  FIREBASE_API_KEY: z.string(),
  COOKIE_SECRET: z.string(),
  SIGN_IN_PATH: z.string(),
  SIGN_UP_PATH: z.string(),
  SERVICE_ACCOUNT: z.string(),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  FIREBASE_APP_NAME: z.string().default("default"),
  APP_TITLE: z.string().default("Remix App"),
});

export const initEnvVariables = () => {
  const env = envSchema.safeParse(process.env);
  if (!env.success) {
    console.error(
      "Invalid environment variables",
      env.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }
  return env.data;
};

export const getServerEnv = () => initEnvVariables();

// manunally add client env variables
export const getClientEnv = () => {
  const {APP_TITLE} = getServerEnv();

  return {title: APP_TITLE};
};

export type CLIENT_ENV = ReturnType<typeof getClientEnv>;
type APP_ENV = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends APP_ENV {}
  }
}
