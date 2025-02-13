"use client";

import type { JSX } from "react";
import { useActionState } from "react";
import { signOutAction } from "@/actions";

export function LogoutButton(): JSX.Element {
  const [, action] = useActionState(signOutAction, {
    message: "",
  });
  return (
    <form action={action}>
      <button type="submit">Sign out</button>
    </form>
  );
}
