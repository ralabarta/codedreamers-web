import { describe, expect, it, vi } from "vitest";

import {
  LOCALES,
  LOCALE_PATHS,
  LOCALE_STORAGE_KEY,
  buildLocaleHref,
  getBootstrapDecision,
  getStorage,
  isLocale,
  localeFromLanguageTag,
  readLocalePreference,
  resolveLocaleRoute,
  writeLocalePreference,
} from "./locale";
import type { StoragePort } from "./locale";

describe("locale contract", () => {
  it("exports the supported locales, canonical paths, and storage key", () => {
    expect(LOCALES).toEqual(["es", "pt-BR", "en"]);
    expect(LOCALE_PATHS).toEqual({
      es: "/es/",
      "pt-BR": "/pt-br/",
      en: "/en/",
    });
    expect(LOCALE_STORAGE_KEY).toBe("codedreamers.locale");
  });

  it("recognizes only supported locales", () => {
    expect(isLocale("es")).toBe(true);
    expect(isLocale("pt-BR")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("pt-br")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it.each([
    ["es", "es"],
    ["ES-mx", "es"],
    ["pt", "pt-BR"],
    ["pt-PT", "pt-BR"],
    ["PT-br", "pt-BR"],
    ["en", "en"],
    ["EN-us", "en"],
    ["fr", null],
  ] as const)("maps browser language %s to %s", (tag, expected) => {
    expect(localeFromLanguageTag(tag)).toBe(expected);
  });
});

describe("resolveLocaleRoute", () => {
  it.each([
    ["/es/", "es"],
    ["/pt-br/", "pt-BR"],
    ["/en/", "en"],
  ] as const)("returns the canonical locale route for %s", (pathname, locale) => {
    expect(
      resolveLocaleRoute({ pathname, savedLocale: "en", browserLanguages: ["fr"] }),
    ).toEqual({ kind: "locale", locale });
  });

  it("prioritizes a valid saved locale at root", () => {
    expect(
      resolveLocaleRoute({
        pathname: "/",
        savedLocale: "pt-BR",
        browserLanguages: ["en-US"],
      }),
    ).toEqual({ kind: "entry", locale: "pt-BR" });
  });

  it("uses the first supported browser language when the saved value is invalid", () => {
    expect(
      resolveLocaleRoute({
        pathname: "/",
        savedLocale: "fr",
        browserLanguages: ["fr-FR", "pt-PT", "en-US"],
      }),
    ).toEqual({ kind: "entry", locale: "pt-BR" });
  });

  it("defaults root to Spanish when no preference is supported", () => {
    expect(
      resolveLocaleRoute({
        pathname: "/",
        savedLocale: undefined,
        browserLanguages: ["fr-FR", "de-DE"],
      }),
    ).toEqual({ kind: "entry", locale: "es" });
  });

  it.each(["/pt/", "/ES/", "/en", "/products", ""])(
    "rejects unsupported or malformed non-root path %s",
    (pathname) => {
      expect(
        resolveLocaleRoute({ pathname, savedLocale: "en", browserLanguages: ["en"] }),
      ).toEqual({ kind: "unsupported", locale: "es" });
    },
  );
});

describe("getBootstrapDecision", () => {
  it.each([
    ["/es/", "es"],
    ["/pt-br/", "pt-BR"],
    ["/en/", "en"],
  ] as const)("renders the active locale for canonical path %s", (pathname, locale) => {
    expect(
      getBootstrapDecision({
        pathname,
        savedLocale: "pt-BR",
        browserLanguages: ["en-US"],
      }),
    ).toEqual({ action: "render", locale });
  });

  it("redirects root to the saved locale before the browser locale", () => {
    expect(
      getBootstrapDecision({
        pathname: "/",
        savedLocale: "pt-BR",
        browserLanguages: ["en-US"],
      }),
    ).toEqual({ action: "redirect", locale: "pt-BR" });
  });

  it("redirects unsupported paths to Spanish regardless of preferences", () => {
    expect(
      getBootstrapDecision({
        pathname: "/de/",
        savedLocale: "en",
        browserLanguages: ["en-US"],
      }),
    ).toEqual({ action: "redirect", locale: "es" });
  });

  it("preserves root browser fallback when no saved locale is valid", () => {
    expect(
      getBootstrapDecision({
        pathname: "/",
        savedLocale: "de",
        browserLanguages: ["de-DE", "pt-PT", "en-US"],
      }),
    ).toEqual({ action: "redirect", locale: "pt-BR" });
  });
});

describe("buildLocaleHref", () => {
  it("appends an existing hash to the canonical locale path", () => {
    expect(buildLocaleHref("pt-BR", "#producto-P32")).toBe(
      "/pt-br/#producto-P32",
    );
  });

  it("adds a missing hash marker", () => {
    expect(buildLocaleHref("en", "producto-P32")).toBe("/en/#producto-P32");
  });

  it("returns the canonical path for an empty hash", () => {
    expect(buildLocaleHref("es", "")).toBe("/es/");
  });
});

describe("locale preference storage", () => {
  it("returns storage from a successful getter and null from a throwing getter", () => {
    const storage: StoragePort = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    };

    expect(getStorage(() => storage)).toBe(storage);
    expect(
      getStorage(() => {
        throw new Error("blocked");
      }),
    ).toBeNull();
  });

  it("reads a valid locale using the locale storage key", () => {
    const getItem = vi.fn(() => "pt-BR");
    const storage: StoragePort = { getItem, setItem: vi.fn() };

    expect(readLocalePreference(storage)).toBe("pt-BR");
    expect(getItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY);
  });

  it("ignores invalid stored values and read errors", () => {
    const invalid: StoragePort = {
      getItem: vi.fn(() => "pt-br"),
      setItem: vi.fn(),
    };
    const throwing: StoragePort = {
      getItem: vi.fn(() => {
        throw new Error("denied");
      }),
      setItem: vi.fn(),
    };

    expect(readLocalePreference(invalid)).toBeNull();
    expect(readLocalePreference(throwing)).toBeNull();
    expect(readLocalePreference(null)).toBeNull();
  });

  it("writes a valid preference with the storage key", () => {
    const setItem = vi.fn();
    const storage: StoragePort = { getItem: vi.fn(() => null), setItem };

    expect(writeLocalePreference(storage, "en")).toBe(true);
    expect(setItem).toHaveBeenCalledWith(LOCALE_STORAGE_KEY, "en");
  });

  it("returns false when storage is unavailable or writing throws", () => {
    const throwing: StoragePort = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error("denied");
      }),
    };

    expect(writeLocalePreference(throwing, "es")).toBe(false);
    expect(writeLocalePreference(null, "es")).toBe(false);
  });
});
