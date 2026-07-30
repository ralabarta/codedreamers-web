import { getDictionary } from "./dictionaries";
import type { Locale } from "./locale";
import type {
  FamilyId,
  FamilyTranslation,
  OutcomeId,
  ProductCode,
  ProductTranslation,
} from "./types";

export interface ProductDefinition {
  code: ProductCode;
  outcomeIds: readonly [OutcomeId];
}

export interface FamilyDefinition {
  id: FamilyId;
  index: string;
  color: string;
  products: readonly ProductDefinition[];
}

export type LocalizedProduct = ProductDefinition & ProductTranslation;

export type LocalizedFamily = Omit<FamilyDefinition, "products"> &
  FamilyTranslation & {
    products: readonly LocalizedProduct[];
  };

const products = (
  outcomeId: OutcomeId,
  codes: readonly ProductCode[],
): readonly ProductDefinition[] =>
  codes.map((code) => ({ code, outcomeIds: [outcomeId] }));

export const catalogDefinition: readonly FamilyDefinition[] = [
  {
    id: "experiencia",
    index: "01",
    color: "#20cfd4",
    products: products("captar", [
      "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08",
    ]),
  },
  {
    id: "ventas",
    index: "02",
    color: "#f347a6",
    products: products("vender", [
      "P09", "P10", "P11", "P12", "P13", "P14", "P15", "P16",
    ]),
  },
  {
    id: "operaciones",
    index: "03",
    color: "#5b63ff",
    products: products("operar", [
      "P17", "P18", "P19", "P20", "P21", "P22", "P23", "P24", "P25",
      "P26", "P27", "P28",
    ]),
  },
  {
    id: "datos",
    index: "04",
    color: "#36cfaa",
    products: products("decidir", [
      "P29", "P30", "P31", "P32", "P33", "P34", "P35", "P36",
    ]),
  },
  {
    id: "ia",
    index: "05",
    color: "#ffb83f",
    products: products("escalar", [
      "P37", "P38", "P39", "P40", "P41", "P42", "P43", "P44",
    ]),
  },
  {
    id: "sectoriales",
    index: "06",
    color: "#8857ff",
    products: products("escalar", [
      "P45", "P46", "P47", "P48", "P49", "P50", "P51", "P52", "P53",
      "P54",
    ]),
  },
];

export const localizeCatalog = (locale: Locale): readonly LocalizedFamily[] => {
  const dictionary = getDictionary(locale);

  return catalogDefinition.map((family) => ({
    ...family,
    ...dictionary.catalog.families[family.id],
    products: family.products.map((product) => ({
      ...product,
      ...dictionary.catalog.products[product.code],
    })),
  }));
};
