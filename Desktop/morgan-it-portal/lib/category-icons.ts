import {
  KeyRound,
  Monitor,
  Wifi,
  Mail,
  Smartphone,
  Printer,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export const categoryIconMap: Record<string, LucideIcon> = {
  "passwords-login": KeyRound,
  "computer-labs": Monitor,
  "campus-wifi": Wifi,
  "email-google": Mail,
  "duo-mfa": Smartphone,
  "printing": Printer,
  "canvas-courses": BookOpen,
  "banner-registration": GraduationCap,
  "vpn-remote": ShieldCheck,
};
