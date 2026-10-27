const BASE_URL = "https://nexareco.com";
const LOCALES = ["ko", "en", "ja", "es"] as const;

export function buildAlternates(locale: string, path: string) {
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = `${BASE_URL}/${loc}${path}`;
  }
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages,
  };
}
