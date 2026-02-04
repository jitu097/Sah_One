import { AuthConfig } from "convex/server";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID;

if (!firebaseProjectId) {
  throw new Error(
    "Missing FIREBASE_PROJECT_ID. Set it with: npx convex env set FIREBASE_PROJECT_ID <your-project-id>"
  );
}

export default {
  providers: [
    {
      type: "customJwt",
      issuer: `https://securetoken.google.com/${firebaseProjectId}`,
      jwks: "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
      algorithm: "RS256",
      applicationID: firebaseProjectId,
    },
  ],
} satisfies AuthConfig;
