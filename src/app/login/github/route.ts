import { getCurrentSession } from "@/actions";
import {
  GITHUB_OAUTH_CODE_VERIFIER_COOKIE_NAME,
  GITHUB_OAUTH_STATE_COOKIE_NAME,
  OAUTH_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/constants";
import { generateCodeVerifier, generateState, github } from "@/lib/oauth";
import { globalGETRateLimit } from "@/lib/requests";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  if (!(await globalGETRateLimit())) {
    return new Response("Too many requests", {
      status: 429,
    });
  }

  const { session } = await getCurrentSession();
  if (session !== null) {
    return Response.redirect(new URL("/", request.url));
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await github.createAuthorizationURLWithPKCE(state, codeVerifier, [
    "user:email",
  ]);

  const c = await cookies();

  const cookieOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax" as const,
  };

  c.set(GITHUB_OAUTH_STATE_COOKIE_NAME, state, cookieOptions);
  c.set(GITHUB_OAUTH_CODE_VERIFIER_COOKIE_NAME, codeVerifier, cookieOptions);

  return Response.redirect(url);
}
