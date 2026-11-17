import type { Metadata } from "next";
import { User } from "lucide-react";

import { DashboardPlaceholderPage } from "@/features/dashboard/components/dashboard-placeholder-page";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <DashboardPlaceholderPage
      title="Profile"
      description="Manage your delivery partner profile and merchant association."
      icon={User}
    />
  );
}