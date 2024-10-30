import {
  getApps,
  initializeApp as initializeServerApp,
  cert as serverCert,
} from "firebase-admin/app";
import { getServerEnv } from "../env-variables.server";

const { FIREBASE_API_KEY, NODE_ENV, SERVICE_ACCOUNT, FIREBASE_APP_NAME } =
  getServerEnv();

// Warning: though getRestConfig is only run server side, its return value may be sent to the client
export const getRestConfig = (): {
  apiKey: string;
  domain: string;
} => {
  if (NODE_ENV === "development" && !FIREBASE_API_KEY) {
    return {
      apiKey: "fake-api-key",
      domain: "http://localhost:9099/identitytoolkit.googleapis.com",
    };
  } else if (!FIREBASE_API_KEY) {
    throw new Error("Missing API_KEY environment variable");
  } else {
    return {
      apiKey: FIREBASE_API_KEY,
      domain: "https://identitytoolkit.googleapis.com",
    };
  }
};
export const initFirebase = () => {
  let config;
  try {
    config = {
      credential: serverCert(JSON.parse(SERVICE_ACCOUNT)),
    };
  } catch {
    throw Error("Invalid SERVICE_ACCOUNT environment variable");
  }

  if (getApps().length > 0) {
    const allApps = getApps();
    const app = allApps.find((app) => app.name === FIREBASE_APP_NAME);
    return app ? app : initializeServerApp(config, FIREBASE_APP_NAME);
  }
  return initializeServerApp(config, FIREBASE_APP_NAME);
};
