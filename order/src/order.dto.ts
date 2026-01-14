import z from "zod";

// addres dto
export const addressSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur"),
  address: z.string().min(1, "Adres zorunludur"),
  city: z.string().min(1, "Şehir zorunludur"),
  district: z.string().min(1, "İlçe zorunludur"),
  postalCode: z.string().min(1, "Posta kodu zorunludur"),
  isDefault: z.boolean().default(false),
});

// Order Item DTO
export const orderItemSchema = z.object({
  productId: z.string().min(1, "Ürün ID'si zorunludur"),
  name: z.string().min(1, "Ürün adı zorunludur"),
  price: z.number().min(1, "Fiyat zorunludur"),
  quantity: z.number().min(1, "Adet zorunludur"),
});

// Order DTO
export const orderSchema = z
  .object({
    restaurantId: z.string().min(1, "Restaurant ID'si zorunludur"),
    items: z.array(orderItemSchema).min(1, "En az 1 ürün seçiniz"),
    deliveryAddress: addressSchema,
    paymentMethod: z.enum(["credit-card", "cash", "mobile_payment"]),
    specialInstructions: z.string().default(""),
  })
  .strip();

//
export type AddressInput = z.infer<typeof addressSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;

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
