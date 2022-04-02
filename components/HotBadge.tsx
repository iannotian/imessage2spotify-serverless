import cx from "classnames";

enum HeatLevel {
  NEW = "New",
  MILD = "Mild",
  SPICY = "Spicy",
  FIRE = "Fire",
}

const heatMap: Map<HeatLevel, `bg-${string}-${number}`> = new Map();
heatMap.set(HeatLevel.NEW, "bg-gray-500");
heatMap.set(HeatLevel.MILD, "bg-yellow-600");
heatMap.set(HeatLevel.SPICY, "bg-orange-500");
heatMap.set(HeatLevel.FIRE, "bg-red-600");

function determineHeatLevel(count: number): HeatLevel {
  if (count > 7) {
    return HeatLevel.FIRE;
  } else if (count > 4) {
    return HeatLevel.SPICY;
  } else if (count > 2) {
    return HeatLevel.MILD;
  }

  return HeatLevel.NEW;
}

export function HotBadge({ count }: { count: number }) {
  const heatLevel = determineHeatLevel(count);

  return (
    <span
      className={cx(
        heatMap.get(heatLevel),
        "text-white uppercase px-1 rounded-md"
      )}
    >
      {heatLevel}
    </span>
  );
}
