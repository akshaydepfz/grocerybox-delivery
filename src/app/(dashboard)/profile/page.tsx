import type { Metadata } from "next";

import { ProfileScreen } from "@/features/dashboard/components/profile-screen";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return <ProfileScreen />;
}