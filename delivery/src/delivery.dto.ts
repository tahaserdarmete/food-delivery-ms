import z from "zod";

// siparişin durumunu güncelle
export const deliveryUpdateSchema = z.object({
  status: z.enum(["on_the_way", "delivered", "cancelled"]),
  location: z
    .object({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
  notes: z.string().optional(),
});

export type DeliveryUpdate = z.infer<typeof deliveryUpdateSchema>;

// Bir şema ve veri alıp verinin şemaya uygunluluğunu kontrol eden fonksiyon
export function validateDTO<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(z.prettifyError(error));
    }

    throw error;
  }
}
