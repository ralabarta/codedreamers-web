import type { Locale } from "./locale";

export type OutcomeId = "captar" | "vender" | "operar" | "decidir" | "escalar";

export type FamilyId =
  | "experiencia"
  | "ventas"
  | "operaciones"
  | "datos"
  | "ia"
  | "sectoriales";

export const PRODUCT_CODES = [
  "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09",
  "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18",
  "P19", "P20", "P21", "P22", "P23", "P24", "P25", "P26", "P27",
  "P28", "P29", "P30", "P31", "P32", "P33", "P34", "P35", "P36",
  "P37", "P38", "P39", "P40", "P41", "P42", "P43", "P44", "P45",
  "P46", "P47", "P48", "P49", "P50", "P51", "P52", "P53", "P54",
] as const;

export type ProductCode = (typeof PRODUCT_CODES)[number];

export interface MessageCount {
  one: string;
  other: string;
}

export interface ProductTranslation {
  name: string;
  description: string;
  includes: readonly [string, string, string];
}

export const PROJECT_MODE_IDS = [
  "product-from-scratch",
  "mvp-prototype",
  "redesign-modernization",
  "new-module",
  "systems-integration",
  "platform-migration",
  "dedicated-team",
  "maintenance-evolution",
  "discovery-ux-ui",
] as const;

export type ProjectModeId = (typeof PROJECT_MODE_IDS)[number];

export type ProjectModeCopy = {
  readonly name: string;
  readonly description: string;
  readonly inclusions: readonly [string, string, string];
  readonly ctaLabel: string;
};

export type ProjectModesCopy = {
  eyebrow: string;
  title: string;
  emailSubjectPrefix: string;
  includesLabel: string;
  items: Readonly<Record<ProjectModeId, ProjectModeCopy>>;
};

export interface FamilyTranslation {
  name: string;
  shortName: string;
  promise: string;
}

export interface OutcomeTranslation {
  label: string;
  lead: string;
  body: string;
  range: string;
}

export interface Dictionary {
  locale: Locale;
  selector: {
    ariaLabel: string;
    labels: Record<Locale, string>;
    activeLabel: string;
  };
  header: {
    brandAriaLabel: string;
    openMenuLabel: string;
    closeMenuLabel: string;
    navigationAriaLabel: string;
    links: {
      solutions: string;
      ecosystem: string;
      sectors: string;
      contact: string;
    };
    contact: string;
  };
  hero: {
    kicker: string;
    title: readonly [string, string, string];
    intro: string;
    primaryAction: string;
    secondaryAction: string;
    atlasTitle: string;
    productLabel: string;
    solutionInitial: string;
    mobileOrigin: string;
    mobileOriginDetail: string;
    proof: readonly [
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
      { value: string; label: string },
    ];
  };
  outcomes: {
    eyebrow: string;
    title: readonly [string, string];
    intro: string;
    ariaLabel: string;
    action: string;
    items: Record<OutcomeId, OutcomeTranslation>;
  };
  catalog: {
    eyebrow: string;
    title: string;
    intro: string;
    downloadsLabel: string;
    downloadsAriaLabel: string;
    downloadAriaLabels: Record<Locale, string>;
    familyFilterAriaLabel: string;
    allFamilies: string;
    searchLabel: string;
    searchPlaceholder: string;
    resultCount: MessageCount;
    includesLabel: string;
    emptyTitle: string;
    emptyBody: string;
    emptyAction: string;
    families: Record<FamilyId, FamilyTranslation>;
    products: Record<ProductCode, ProductTranslation>;
  };
  ecosystem: {
    eyebrow: string;
    title: readonly [string, string, string];
    intro: string;
    ariaLabel: string;
    origin: string;
    destination: string;
    layers: readonly string[];
    example: string;
  };
  formats: {
    eyebrow: string;
    title: string;
    items: readonly string[];
  };
  capabilities: {
    eyebrow: string;
    title: string;
    intro: string;
    items: readonly string[];
  };
  sectors: {
    eyebrow: string;
    title: readonly [string, string];
    items: readonly string[];
  };
  projectModes: ProjectModesCopy;
  backToTop: {
    ariaLabel: string;
  };
  contact: {
    eyebrow: string;
    title: readonly [string, string, string];
    action: string;
    mailSubject: string;
    whatsappAriaLabel: string;
    whatsappMessage: string;
    footerSummary: string;
  };
  status: {
    system: string;
    route: string;
    ecosystemLabel: string;
  };
  seo: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogLocale: "es_ES" | "pt_BR" | "en_US";
    ogImageAlt: string;
    twitterTitle: string;
    twitterDescription: string;
    organizationDescription: string;
    knowsAbout: readonly string[];
  };
}
