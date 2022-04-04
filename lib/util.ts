enum TimeUnitMilliseconds {
  "year" = 1000 * 3600 * 24 * 365,
  "month" = 1000 * 3600 * 24 * 30,
  "week" = 1000 * 3600 * 24 * 7,
  "day" = 1000 * 3600 * 24,
  "hour" = 1000 * 3600,
  "minute" = 1000 * 60,
  "second" = 1000,
}

const unitToMsMap: Map<Intl.RelativeTimeFormatUnit, TimeUnitMilliseconds> =
  new Map([
    ["year", TimeUnitMilliseconds["year"]],
    ["month", TimeUnitMilliseconds["month"]],
    ["week", TimeUnitMilliseconds["week"]],
    ["day", TimeUnitMilliseconds["day"]],
    ["hour", TimeUnitMilliseconds["hour"]],
    ["minute", TimeUnitMilliseconds["minute"]],
    ["second", TimeUnitMilliseconds["second"]],
  ]);

export function formatTimeAgo(dateString: string, locale?: string): string {
  const date = new Date(dateString);

  let remainingMs = date.getTime() - Date.now();
  let timeDelta = 0;
  let lastUnit: Intl.RelativeTimeFormatUnit = "year";

  for (const [unit, unitMs] of unitToMsMap.entries()) {
    if (remainingMs > unitMs) {
      remainingMs = remainingMs % unitMs;
    } else {
      timeDelta = (date.getTime() - Date.now()) / unitMs;
      lastUnit = unit;

      if (Math.abs(timeDelta) >= 1) {
        break;
      }
    }
  }

  const formatter = new Intl.RelativeTimeFormat(locale);
  return formatter.format(Math.round(timeDelta), lastUnit);
}
