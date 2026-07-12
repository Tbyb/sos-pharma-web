/**
 * Badge de disponibilité médicament — élément signature DESIGN.md ("pouls de disponibilité").
 * @param {{ disponible: boolean }} props
 */
export default function DisponibiliteBadge({ disponible }) {
  if (disponible) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-vert-menthe text-vert-profond whitespace-nowrap">
        <span className="disponible-indicator" />
        Disponible
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#FEE2E2] text-[#991B1B] whitespace-nowrap">
      Indisponible
    </span>
  );
}
