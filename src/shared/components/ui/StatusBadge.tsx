// Файл: src/shared/components/ui/StatusBadge.tsx

import { cn } from "@/shared/lib/utils"; // Убедись, что cn импортируется верно. Если нет, попробуй '@shared/lib/utils'

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  new: "bg-blue-100 text-blue-800 border-blue-200",
  default: "bg-gray-100 text-gray-800 border-gray-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Приводим статус к нижнему регистру, чтобы найти стиль
  const style = statusStyles[status?.toLowerCase()] || statusStyles.default;

  // Перевод статусов (опционально)
  const labels: Record<string, string> = {
    pending: "На проверке",
    approved: "Одобрено",
    rejected: "Отклонено",
    new: "Новая",
  };

  const label = labels[status?.toLowerCase()] || status;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        style,
        className
      )}
    >
      {label}
    </span>
  );
}