const COUPANG_AF_CODE = "AF1651276";
const AMAZON_US_TAG = "nexareco20-20";
const AMAZON_JP_TAG = "nexareco-22";

export function getCoupangSearchUrl(productName: string): string {
  const query = encodeURIComponent(productName);
  return `https://link.coupang.com/a/${COUPANG_AF_CODE}?lptag=AF${COUPANG_AF_CODE}&pageKey=0&traceid=V0-153&itemId=0&vendorItemId=0&q=${query}`;
}

export function getAmazonSearchUrl(productName: string, locale: string): string {
  const query = encodeURIComponent(productName);
  if (locale === "ja") {
    return `https://www.amazon.co.jp/s?k=${query}&tag=${AMAZON_JP_TAG}`;
  }
  return `https://www.amazon.com/s?k=${query}&tag=${AMAZON_US_TAG}`;
}

export function getAffiliateUrl(productName: string, locale: string): string {
  if (locale === "ko") return "";
  if (locale === "ja") return getAmazonSearchUrl(productName, "ja");
  return getAmazonSearchUrl(productName, "en");
}
