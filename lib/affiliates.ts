type Locale = "ko" | "en" | "ja" | "es";
type Platform = "coupang" | "amazon-us" | "amazon-jp" | "amazon-es";

interface AffiliateConfig {
  platform: Platform;
  baseUrl: string;
  tag: string;
}

const affiliateConfigs: Record<Locale, AffiliateConfig> = {
  ko: {
    platform: "coupang",
    baseUrl: "https://www.coupang.com/np/search?query=",
    tag: "nexareco-10",
  },
  en: {
    platform: "amazon-us",
    baseUrl: "https://www.amazon.com/s?k=",
    tag: "nexareco-20",
  },
  ja: {
    platform: "amazon-jp",
    baseUrl: "https://www.amazon.co.jp/s?k=",
    tag: "nexareco-20",
  },
  es: {
    platform: "amazon-es",
    baseUrl: "https://www.amazon.es/s?k=",
    tag: "nexareco-20",
  },
};

export function getAffiliateLink(productName: string, locale: Locale): string {
  const config = affiliateConfigs[locale];
  const encodedProduct = encodeURIComponent(productName);

  if (config.platform === "coupang") {
    return `${config.baseUrl}${encodedProduct}&tag=${config.tag}`;
  }

  return `${config.baseUrl}${encodedProduct}&tag=${config.tag}`;
}

export function replaceAffiliatePlaceholders(
  content: string,
  locale: Locale
): string {
  return content.replace(
    /\{\{affiliate:(.+?)\}\}/g,
    (_match, productName: string) => {
      const link = getAffiliateLink(productName.trim(), locale);
      return link;
    }
  );
}
