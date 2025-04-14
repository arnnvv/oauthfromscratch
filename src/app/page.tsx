import { ProfileContent } from "@/components/Profile";
import { Suspense, type JSX } from "react";

export default function ProfilePage(): JSX.Element {
  return (
    <Suspense fallback={<>Loading...</>}>
      <ProfileContent />
    </Suspense>
  );
}
