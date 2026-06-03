export const MILES_TO_KM = 1.609344;

export function milesToKm(miles: number): number {
  return miles * MILES_TO_KM;
}

export function kmToMiles(km: number): number {
  return km / MILES_TO_KM;
}

/** Miles shown after conversion from km (max 2 decimal places). */
export function formatMiles(miles: number): string {
  if (!Number.isFinite(miles) || miles <= 0) return '0';
  return parseFloat(miles.toFixed(2)).toString();
}

export function timeToSeconds(hours: number, minutes: number, seconds: number): number {
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '00 sec';
  const s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h} hr ${m} min ${sec} sec`;
  }
  if (m > 0) {
    return `${m} min ${sec} sec`;
  }
  return `${sec} sec`;
}

export function formatPaceSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00';
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export type PaceResult = {
  secPerMile: number;
  secPerKm: number;
  mph: number;
  kmh: number;
};

export function calculatePace(distanceMiles: number, timeSeconds: number): PaceResult | null {
  if (distanceMiles <= 0 || timeSeconds <= 0) return null;
  const distanceKm = milesToKm(distanceMiles);
  return {
    secPerMile: timeSeconds / distanceMiles,
    secPerKm: timeSeconds / distanceKm,
    mph: distanceMiles / (timeSeconds / 3600),
    kmh: distanceKm / (timeSeconds / 3600),
  };
}

export type RacePreset = {
  label: string;
  miles: number;
};

export const QUICK_DISTANCES: RacePreset[] = [
  { label: '5 km', miles: kmToMiles(5) },
  { label: '10 km', miles: kmToMiles(10) },
  { label: '15 km', miles: kmToMiles(15) },
  { label: '20 km', miles: kmToMiles(20) },
  { label: '13.1 mi', miles: 13.1 },
  { label: '26.2 mi', miles: 26.2 },
];

export const PROPORTIONAL_RACES: RacePreset[] = QUICK_DISTANCES;

export function proportionalTime(secPerMile: number, distanceMiles: number): number {
  return secPerMile * distanceMiles;
}
