// Файл: src/shared/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Утилита для объединения классов Tailwind.
 * Позволяет использовать условные классы и разрешает конфликты стилей
 * (например, p-4 перекроет p-2).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}