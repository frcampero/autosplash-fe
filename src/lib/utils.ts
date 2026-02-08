import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Números de página a mostrar: siempre la misma cantidad (1, "...", ventana fija de 5, "...", total). */
export function getPageRange(
  current: number,
  total: number,
  middleSize = 5
): (number | "ellipsis")[] {
  if (total <= 1) return total === 1 ? [1] : [];
  if (total <= middleSize + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [];
  pages.push(1);

  let start = Math.max(2, current - Math.floor(middleSize / 2));
  let end = Math.min(total - 1, start + middleSize - 1);
  if (end - start + 1 < middleSize) {
    start = Math.max(2, end - middleSize + 1);
  }

  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}