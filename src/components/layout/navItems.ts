import { LayoutGrid, Bell, User, BookOpen, Settings } from "lucide-react";

export const studentNavItems = [
  {
    label: "Dashboard",
    href: "/student",
    icon: LayoutGrid,
  },
  {
    label: "Profile",
    href: "/student/profile",
    icon: User,
  },
  {
    label: "Notifications",
    href: "/student/notifications",
    icon: Bell,
  },
  {
    label: "Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    label: "Settings",
    href: "/student/settings",
    icon: Settings,
  },
];
