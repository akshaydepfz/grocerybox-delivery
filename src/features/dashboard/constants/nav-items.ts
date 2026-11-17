import {
  CircleHelp,
  Clock,
  Home,
  IndianRupee,
  LogOut,
  Package,
  User,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  id: string;
  label: string;
  shortLabel?: string;
  href: string;
  icon: LucideIcon;
  mobileBottom?: boolean;
};

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  {
    id: "home",
    label: "Home",
    shortLabel: "Home",
    href: "/dashboard",
    icon: Home,
    mobileBottom: true,
  },
  {
    id: "deliveries",
    label: "My Deliveries",
    shortLabel: "Deliveries",
    href: "/deliveries",
    icon: Package,
    mobileBottom: true,
  },
  {
    id: "history",
    label: "Delivery History",
    shortLabel: "History",
    href: "/history",
    icon: Clock,
    mobileBottom: true,
  },
  {
    id: "earnings",
    label: "Earnings",
    shortLabel: "Earnings",
    href: "/earnings",
    icon: IndianRupee,
    mobileBottom: true,
  },
  {
    id: "profile",
    label: "Profile",
    shortLabel: "Profile",
    href: "/profile",
    icon: User,
    mobileBottom: true,
  },
];

export const DASHBOARD_SIDEBAR_EXTRA: DashboardNavItem[] = [
  {
    id: "help",
    label: "Help & Support",
    href: "/profile",
    icon: CircleHelp,
  },
  {
    id: "logout",
    label: "Logout",
    href: "#logout",
    icon: LogOut,
  },
];

export const MOBILE_BOTTOM_NAV = DASHBOARD_NAV_ITEMS.filter((item) => item.mobileBottom);