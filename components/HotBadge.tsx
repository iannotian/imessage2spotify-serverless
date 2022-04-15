import cx from "classnames";

enum HeatLevel {
  NEW = "New",
  MILD = "Mild",
  SPICY = "Spicy",
  FIRE = "Fire",
}

const heatLevelToTwBgColorClassMap: Map<HeatLevel, `bg-${string}-${number}`> =
  new Map();
heatLevelToTwBgColorClassMap.set(HeatLevel.NEW, "bg-gray-400");
heatLevelToTwBgColorClassMap.set(HeatLevel.MILD, "bg-yellow-600");
heatLevelToTwBgColorClassMap.set(HeatLevel.SPICY, "bg-orange-500");
heatLevelToTwBgColorClassMap.set(HeatLevel.FIRE, "bg-red-600");

function determineHeatLevelFromCount(count: number): HeatLevel {
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
  const heatLevel = determineHeatLevelFromCount(count);

  return (
    <span
      className={cx(
        heatLevelToTwBgColorClassMap.get(heatLevel),
        "inline-block text-white font-semibold uppercase px-2 leading-relaxed rounded-md"
      )}
    >
      {heatLevel}
    </span>
  );
}
