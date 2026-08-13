export type Product = {
  id: string;
  name: string;
  description: string | null;
  price_paise: number;
  image_url: string | null;
  category: string;
  age_group: string;
  stock: number;
  is_active: boolean;
};

export type CartItem = {
  product_id: string;
  name: string;
  price_paise: number;
  image_url: string | null;
  qty: number;
};

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}
