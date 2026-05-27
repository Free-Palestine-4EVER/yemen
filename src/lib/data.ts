import type { Locale } from "./i18n/dictionary";

export interface Destination {
  code: string;
  flag: string;
  en: string;
  ar: string;
  /** city used in subtle imagery / copy */
  hub: { en: string; ar: string };
}

export const DESTINATIONS: Destination[] = [
  { code: "DE", flag: "🇩🇪", en: "Germany", ar: "ألمانيا", hub: { en: "Berlin", ar: "برلين" } },
  { code: "FR", flag: "🇫🇷", en: "France", ar: "فرنسا", hub: { en: "Paris", ar: "باريس" } },
  { code: "IT", flag: "🇮🇹", en: "Italy", ar: "إيطاليا", hub: { en: "Rome", ar: "روما" } },
  { code: "NL", flag: "🇳🇱", en: "Netherlands", ar: "هولندا", hub: { en: "Amsterdam", ar: "أمستردام" } },
  { code: "ES", flag: "🇪🇸", en: "Spain", ar: "إسبانيا", hub: { en: "Madrid", ar: "مدريد" } },
  { code: "SE", flag: "🇸🇪", en: "Sweden", ar: "السويد", hub: { en: "Stockholm", ar: "ستوكهولم" } },
  { code: "PL", flag: "🇵🇱", en: "Poland", ar: "بولندا", hub: { en: "Warsaw", ar: "وارسو" } },
  { code: "BE", flag: "🇧🇪", en: "Belgium", ar: "بلجيكا", hub: { en: "Brussels", ar: "بروكسل" } },
  { code: "AT", flag: "🇦🇹", en: "Austria", ar: "النمسا", hub: { en: "Vienna", ar: "فيينا" } },
  { code: "FI", flag: "🇫🇮", en: "Finland", ar: "فنلندا", hub: { en: "Helsinki", ar: "هلسنكي" } },
  { code: "IE", flag: "🇮🇪", en: "Ireland", ar: "إيرلندا", hub: { en: "Dublin", ar: "دبلن" } },
  { code: "PT", flag: "🇵🇹", en: "Portugal", ar: "البرتغال", hub: { en: "Lisbon", ar: "لشبونة" } },
  { code: "DK", flag: "🇩🇰", en: "Denmark", ar: "الدنمارك", hub: { en: "Copenhagen", ar: "كوبنهاغن" } },
  { code: "NO", flag: "🇳🇴", en: "Norway", ar: "النرويج", hub: { en: "Oslo", ar: "أوسلو" } },
  { code: "CZ", flag: "🇨🇿", en: "Czechia", ar: "التشيك", hub: { en: "Prague", ar: "براغ" } },
];

/** Yemeni origin cities — used in the journey motif and identity copy. */
export const YEMEN = {
  flag: "🇾🇪",
  en: "Yemen",
  ar: "اليمن",
  capital: { en: "Sana'a", ar: "صنعاء" },
  cities: [
    { en: "Sana'a", ar: "صنعاء" },
    { en: "Aden", ar: "عدن" },
    { en: "Taiz", ar: "تعز" },
    { en: "Hodeidah", ar: "الحديدة" },
    { en: "Ibb", ar: "إب" },
    { en: "Mukalla", ar: "المكلا" },
    { en: "Seiyun", ar: "سيئون" },
  ],
};

export function destinationName(code: string, locale: Locale) {
  const d = DESTINATIONS.find((x) => x.code === code);
  return d ? d[locale] : code;
}

export function destinationByCode(code: string) {
  return DESTINATIONS.find((x) => x.code === code);
}

export type Track = "student" | "job";

export const TRACK_FEE: Record<Track, number> = {
  student: 30,
  job: 80,
};

export const DEGREE_OPTIONS = ["bachelor", "master", "diploma", "phd"] as const;
export const LANG_LEVELS = ["basic", "intermediate", "fluent", "native"] as const;
