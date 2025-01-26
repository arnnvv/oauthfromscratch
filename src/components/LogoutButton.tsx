"use client";

import { signOutAction } from "@/actions";
import { useActionState } from "react";

const initialState = {
  message: "",
};

export function LogoutButton() {
  const [, action] = useActionState(signOutAction, initialState);
  return (
    <form action={action}>
      <button>Sign out</button>
    </form>
  );
}
