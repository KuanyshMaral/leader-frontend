export default function StatusBadge({ status }) {
  const styles = {
    draft: "bg-gray-100 text-gray-600",
    submitted: "bg-blue-100 text-blue-700",
    bank_review: "bg-yellow-100 text-yellow-800",
    offer_received: "bg-green-100 text-green-700", // "Гарантия выдана" на скрине
    rejected: "bg-red-100 text-red-700", // "Отмена"
    returned_for_revision: "bg-orange-100 text-orange-800", // "Возвращена на доработку"
  };

  const labels = {
    draft: "Черновик",
    submitted: "Отправлена",
    bank_review: "На проверке",
    offer_received: "Предложение получено",
    rejected: "Отказано",
    returned_for_revision: "На доработке",
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${styles[status] || styles.draft}`}>
      {labels[status] || status}
    </span>
  );
}