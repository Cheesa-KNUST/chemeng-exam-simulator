import {
  LayoutGrid,
  User,
  BookOpen,
  Settings,
  HelpCircle,
  Sparkles,
  History,
  FileText,
  PlusCircle,
  Mail,
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
  // {
  //   label: "JudeAI",
  //   href: "/student/jude",
  //   icon: Sparkles,
  // },
  {
    label: "Help",
    href: "/student/help",
    icon: HelpCircle,
  },
];

export const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutGrid,
  },
  {
    label: "Manage Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    label: "Manage Exams",
    href: "/admin/exams",
    icon: FileText,
  },
  {
    label: "Create Exams",
    href: "/admin/exams/new",
    icon: PlusCircle,
  },
];

export const bottomNav = [
  {
    label: "Send Notifications",
    href: "/admin/notification",
    icon: Mail,
  },
  {
    label: "JudeAI",
    href: "/admin/jude",
    icon: Sparkles,
  },
];
