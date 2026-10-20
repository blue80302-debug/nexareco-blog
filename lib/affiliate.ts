const COUPANG_AF_CODE = "AF1651276";

export function getCoupangSearchUrl(productName: string): string {
  const query = encodeURIComponent(productName);
  return `https://link.coupang.com/a/${COUPANG_AF_CODE}?lptag=AF${COUPANG_AF_CODE}&pageKey=0&traceid=V0-153&itemId=0&vendorItemId=0&q=${query}`;
}
