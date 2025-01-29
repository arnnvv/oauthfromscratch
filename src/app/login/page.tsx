import { redirect } from "next/navigation";
import { getCurrentSession } from "@/actions";
import { globalGETRateLimit } from "@/lib/requests";
import type { JSX } from "react";

export default async function Page(): Promise<JSX.Element> {
  if (!globalGETRateLimit()) return <>Too many requests</>;
  const { session } = await getCurrentSession();
  if (session !== null) return redirect("/");

  return <a href="/login/google">Sign in with Google</a>;
}
