import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function createPageUrl(pageName) {
  // Creates a URL for navigating to a page
  // Usage: createPageUrl('Home') → '/home'
  // With params: createPageUrl('ProjectDetail?id=123') → '/project-detail?id=123'
  return `/${pageName.toLowerCase().replace(/([A-Z])/g, '-$1')}`;
}