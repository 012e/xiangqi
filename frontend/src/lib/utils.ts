import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractErrorDetail(e: any): string {
  if (e.response && e.response.data && e.response.data.detail) {
    return e.response.data.detail;
  }
  if (e.message) {
    return e.message;
  }
  return 'An unknown error occurred';
}
