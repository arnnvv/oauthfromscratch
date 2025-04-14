"use server";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { globalPOSTRateLimit } from "./lib/requests";
import { deleteSessionTokenCookie } from "./lib/session";
import type { SessionValidationResult } from "./lib/auth";
import { invalidateSession, validateSessionToken } from "./lib/auth";

export const getCurrentSession = cache(
  async (): Promise<SessionValidationResult> => {
    const token = (await cookies()).get("session")?.value ?? null;
    if (token === null) {
      return {
        session: null,
        user: null,
      };
    }
    const result = await validateSessionToken(token);
    return result;
  },
);

export const signOutAction = async (): Promise<{
  message: string;
}> => {
  const { session } = await getCurrentSession();
  if (session === null)
    return {
      message: "Not authenticated",
    };

  if (!(await globalPOSTRateLimit())) {
    return {
      message: "Too many requests",
    };
  }
  try {
    await invalidateSession(session.id);
    await deleteSessionTokenCookie();
    return redirect("/login");
  } catch (e) {
    return {
      message: `Error LoggingOut ${e}`,
    };
  }
};
