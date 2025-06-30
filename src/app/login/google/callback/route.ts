import { cookies } from "next/headers";
import { decodeIdToken, google } from "@/lib/oauth";
import {
  createUser,
  getUserFromGoogleId,
  updateUserIfNeeded,
} from "@/lib/user";
import { createSession, generateSessionToken } from "@/lib/auth";
import { setSessionTokenCookie } from "@/lib/session";
import { getCurrentSession } from "@/actions";
import { ObjectParser } from "@/lib/parser";
import type { OAuth2Tokens } from "@/lib/oauth-token";
import { globalGETRateLimit } from "@/lib/requests";

export async function GET(request: Request): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response("Too many requests", {
      status: 429,
    });
  }
  const { session } = await getCurrentSession();
  if (session !== null)
    return new Response("Logged In", {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState =
    (await cookies()).get("google_oauth_state")?.value ?? null;
  const codeVerifier =
    (await cookies()).get("google_code_verifier")?.value ?? null;
  if (
    code === null ||
    state === null ||
    storedState === null ||
    codeVerifier === null
  ) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }
  if (state !== storedState) {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return new Response("Please restart the process.", {
      status: 400,
    });
  }

  const claims = decodeIdToken(tokens.idToken());
  const claimsParser = new ObjectParser(claims);

  const googleId = claimsParser.getString("sub");
  const name = claimsParser.getString("name");
  const picture = claimsParser.getString("picture");
  const email = claimsParser.getString("email");

  const existingUser = await getUserFromGoogleId(googleId);

  let userId: number;

  if (existingUser) {
    userId = existingUser.id;
    if (existingUser.name !== name || existingUser.picture !== picture) {
      await updateUserIfNeeded(userId, {
        name,
        picture,
      });
    }
  } else {
    const newUser = await createUser(googleId, email, name, picture);
    userId = newUser.id;
  }

  const sessionToken = generateSessionToken();
  const newSession = await createSession(sessionToken, userId);
  setSessionTokenCookie(sessionToken, newSession.expires_at);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
    },
  });
}
