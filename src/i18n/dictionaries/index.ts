import type { Locale } from "../locale";
import type { Dictionary } from "../types";
import { en } from "./en";
import { es } from "./es";
import { ptBR } from "./ptBR";

export const dictionaries = { es, "pt-BR": ptBR, en } as const satisfies Record<
  Locale,
  Dictionary
>;

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
