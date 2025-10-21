import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPermissionName(name: string): string {
  if (!name) return "";
  return name
    .split(":")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
