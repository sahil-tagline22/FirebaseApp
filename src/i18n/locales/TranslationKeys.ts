import en from "./en.json";

type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj]: TObj[TKey] extends object
    ? `${TKey & string}.${RecursiveKeyOf<TObj[TKey]>}`
    : TKey & string;
}[keyof TObj];

export type TranslationKey = RecursiveKeyOf<typeof en>;

export const TranslationKeys = new Proxy(
  {},
  {
    get: (_, prop: string) => prop,
  }
) as { [K in TranslationKey]: K };
