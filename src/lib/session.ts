import { cookies } from "next/headers";

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date,
): Promise<void> {
  (await cookies()).set("session", token, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiresAt,
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  (await cookies()).set("session", "", {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });
}
