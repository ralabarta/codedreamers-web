export const LOCALES = ["es", "pt-BR", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_STORAGE_KEY = "codedreamers.locale";

export const LOCALE_PATHS = {
  es: "/es/",
  "pt-BR": "/pt-br/",
  en: "/en/",
} as const satisfies Record<Locale, string>;

export type LocaleRoute =
  | { kind: "locale"; locale: Locale }
  | { kind: "entry"; locale: Locale }
  | { kind: "unsupported"; locale: "es" };

export type BootstrapDecision =
  | { action: "render"; locale: Locale }
  | { action: "redirect"; locale: Locale };

export type StoragePort = Pick<Storage, "getItem" | "setItem">;

export interface LocaleResolutionInput {
  pathname: string;
  savedLocale: unknown;
  browserLanguages: readonly string[];
}

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

export function localeFromLanguageTag(languageTag: string): Locale | null {
  const language = languageTag.toLowerCase().split("-")[0];

  if (language === "pt") return "pt-BR";
  if (language === "en") return "en";
  if (language === "es") return "es";
  return null;
}

export function resolveLocaleRoute({
  pathname,
  savedLocale,
  browserLanguages,
}: LocaleResolutionInput): LocaleRoute {
  for (const locale of LOCALES) {
    if (pathname === LOCALE_PATHS[locale]) {
      return { kind: "locale", locale };
    }
  }

  if (pathname !== "/") {
    return { kind: "unsupported", locale: "es" };
  }

  if (isLocale(savedLocale)) {
    return { kind: "entry", locale: savedLocale };
  }

  for (const languageTag of browserLanguages) {
    const locale = localeFromLanguageTag(languageTag);
    if (locale) return { kind: "entry", locale };
  }

  return { kind: "entry", locale: "es" };
}

export function getBootstrapDecision(
  input: LocaleResolutionInput,
): BootstrapDecision {
  const route = resolveLocaleRoute(input);
  return route.kind === "locale"
    ? { action: "render", locale: route.locale }
    : { action: "redirect", locale: route.locale };
}

export function buildLocaleHref(locale: Locale, hash: string): string {
  if (!hash) return LOCALE_PATHS[locale];
  return `${LOCALE_PATHS[locale]}${hash.startsWith("#") ? hash : `#${hash}`}`;
}

export function getStorage(getter: () => StoragePort): StoragePort | null {
  try {
    return getter();
  } catch {
    return null;
  }
}

export function readLocalePreference(storage: StoragePort | null): Locale | null {
  try {
    const value = storage?.getItem(LOCALE_STORAGE_KEY);
    return isLocale(value) ? value : null;
  } catch {
    return null;
  }
}

export function writeLocalePreference(
  storage: StoragePort | null,
  locale: Locale,
): boolean {
  try {
    if (!storage) return false;
    storage.setItem(LOCALE_STORAGE_KEY, locale);
    return true;
  } catch {
    return false;
  }
}
