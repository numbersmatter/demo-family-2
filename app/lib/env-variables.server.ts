import { z } from "zod";
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  FIREBASE_API_KEY: z.string(),
  COOKIE_SECRET: z.string(),
  SIGN_IN_PATH: z.string(),
  SIGN_UP_PATH: z.string(),
  SERVICE_ACCOUNT: z.string(),
  FIREBASE_APP_NAME: z.string().default("default"),
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
  const serverEnv = getServerEnv();

  return {};
};

export type CLIENT_ENV = ReturnType<typeof getClientEnv>;
type APP_ENV = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends APP_ENV {}
  }
}
