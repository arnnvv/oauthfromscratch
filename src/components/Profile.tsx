import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/actions";
import { LogoutButton } from "@/components/LogoutButton";
import { globalGETRateLimit } from "@/lib/requests";
import type { JSX } from "react";

export async function ProfileContent(): Promise<JSX.Element> {
  const { user, session } = await getCurrentSession();

  if (session === null) return redirect("/login");

  if (!(await globalGETRateLimit())) {
    return <div>Too many requests</div>;
  }

  return (
    <>
      <h1>{user.name}</h1>
      <Image src={user.picture} alt="profile" height={100} width={100} />
      <p>{user.email}</p>
      <LogoutButton />
    </>
  );
}
