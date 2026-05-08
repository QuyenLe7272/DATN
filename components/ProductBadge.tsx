export type ProductBadgeType = "HOT" | "NEW" | "SALE" | null | undefined;

type ProductBadgeProps = {
  badgeType: ProductBadgeType;
  discountPercent?: number | null;
  className?: string;
};

export default function ProductBadge({
  badgeType,
  discountPercent,
  className = "",
}: ProductBadgeProps) {
  if (!badgeType) return null;

  const base =
    "badge-base " +
    (badgeType === "HOT"
      ? "badge-hot"
      : badgeType === "NEW"
        ? "badge-new"
        : "badge-sale");

  const icon = badgeType === "HOT" ? "🔥" : badgeType === "NEW" ? "✨" : "";

  const label =
    badgeType === "SALE"
      ? `SALE ${discountPercent ? Math.round(discountPercent) : ""}%`.trim()
      : badgeType;

  return (
    <div className={`${base} ${className}`.trim()}>
      {icon ? <span aria-hidden>{icon}</span> : null}
      <span className="relative">{label}</span>
    </div>
  );
}

