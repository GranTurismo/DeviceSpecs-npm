export const Brands = {
  Apple: "Apple",
  Samsung: "Samsung",
  Google: "Google",
  Xiaomi: "Xiaomi",
  OnePlus: "OnePlus",
  Nothing: "Nothing",
  Motorola: "Motorola",
  Sony: "Sony",
  Asus: "Asus",
  Huawei: "Huawei",
  Oppo: "Oppo",
  Vivo: "Vivo",
  Realme: "Realme",
  Honor: "Honor",
  Lenovo: "Lenovo",
  Lg: "LG",
  Htc: "HTC",
  Nokia: "Nokia",
} as const;

export type BrandName = typeof Brands[keyof typeof Brands] | (string & {});
