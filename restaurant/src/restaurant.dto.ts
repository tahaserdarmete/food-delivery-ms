import z from "zod";

// Yeni bir restorant oluşturur client'dan gelen veriyi kontrol eden şema
export const createRestaurantSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  address: z.string().min(10, "Adres en az 10 karakter olmalıdır"),
  phone: z.string().min(2, "Telefon numarası en az 2 karakter olmalıdır"),
  email: z.email("Geçerli bir email adresi giriniz"),
  categories: z.array(z.string()).min(1, "En az 1 kategori seçiniz"),
  deliveryTime: z
    .number()
    .min(10, "Teslimat süresi en az 10 dakika olmalıdır")
    .max(120, "Teslimat süresi en fazla 120 dakika olmalıdır"),
  minOrderPrice: z.number().min(0, "Min. sipariş tutarı 0'dan küçük olamaz"),
  deliveryFee: z.number().min(0, "Teslimat ücreti 0'dan küçük olamaz"),
  isActive: z.boolean().default(true),
  isOpen: z.boolean().default(false),
});

// queryParams schema
export const queryParamsSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .positive("Sayfa numarası 1'den büyük olmalıdır")
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, "Limit 1'den küçük olamaz")
    .max(100, "Limit 100'den büyük olamaz")
    .default(10),
  categories: z.coerce.string().optional(),
  name: z.coerce.string().optional(),
  deliveryTime: z.coerce
    .number()
    .min(15, "Teslimat süresi en az 15 dakika olmalıdır")
    .max(120, "Teslimat süresi en fazla 120 dakika olmalıdır")
    .optional(),
  minOrderPrice: z.coerce
    .number()
    .min(0, "Min. sipariş tutarı 0'dan küçük olamaz")
    .optional(),
});

// Menüye yeni bir ürün ekleme şeması
export const createMenuItemSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  price: z.number().min(0, "Fiyat 0'dan küçük olamaz"),
  category: z.string().min(2, "Kategori en az 2 karakter olmalıdır"),
  imageUrl: z.url("Geçerli bir resim URL'i giriniz").default(""),
  ingredients: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  isVegetarian: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  preparationTime: z
    .number()
    .min(5, "Hazırlama süresi en az 5 dakika olmalıdır")
    .max(120, "Hazırlama süresi en fazla 120 dakika olmalıdır"),
});

// infer type
export type QueryParamsInput = z.infer<typeof queryParamsSchema>;
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

// Bir şema ve veri alıp verinin şemaya uygunluluğunu kontrol eden fonksiyon
export async function validateDTO<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(z.prettifyError(error));
    }

    throw error;
  }
}
