import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Exclude domain from an an url
 * @param src File's url (start with "/")
 * @param domain Domain to exclude
 * @returns Relative url of resource
 */
export function excludeDomain(url: string, domain: string) {
  if (typeof url !== "string" || typeof domain !== "string") {
    return url;
  }
  if (url.startsWith(domain)) {
    return url.replace(domain, "");
  }
  return url;
}

function safeJoinUrl(domain: string, path: string) {
  if (!domain) throw new Error("Missing domain");
  if (!path) path = "";

  // 1. Domain phải là absolute URL
  let base;
  try {
    base = new URL(domain);
  } catch {
    throw new Error("Invalid domain");
  }

  // 2. Path KHÔNG được là absolute URL
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) {
    throw new Error("Path must be relative, not absolute URL");
  }

  // 3. Không cho protocol-relative (//evil.com)
  if (path.startsWith("//")) {
    throw new Error("Invalid path");
  }

  return new URL(path, base).href;
}

/**
 * Append domain to the start of an url if it's not start with http(s)
 * @param src File's url (start with "/")
 * @param domain Domain to append
 * @returns Full url of resource
 */
export function appendDomain(src: string, domain: string): string {
  try {
    return safeJoinUrl(domain, src);
  } catch {
    return src;
  }
}

export function extractPathname(src: string): string {
  const urlObj = new URL(src);
  return urlObj.pathname;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
