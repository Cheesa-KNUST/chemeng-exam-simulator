import {
  LayoutGrid,
  Bell,
  User,
  BookOpen,
  Settings,
  HelpCircle,
  Sparkles,
  History,
} from "lucide-react";

export const topNavItems = [
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
    label: "Exam History",
    href: "/student/history",
    icon: History,
  },
];

export const bottomNavItems = [
  {
    label: "Settings",
    href: "/student/settings",
    icon: Settings,
  },
  {
    label: "JudeAI",
    href: "/student/jude",
    icon: Sparkles,
  },
  {
    label: "Help",
    href: "/student/help",
    icon: HelpCircle,
  },
];
