import { z } from "zod";

// Şifre için regex
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

// Zod Shema
// Bu şema sayesinde client'tan gelen body kısmındaki verinin formatını ve verilerin validasyonunu yapacağız.
export const registerSchema = z.object({
  email: z.email("Geçerli bir email adresi giriniz"),
  password: z
    .string()
    .min(6, "Şifre minumum 6 karakter olmalıdır")
    .regex(regex, "Şifreniz yeterince güçlü değil"),
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 6 karakter olmalıdır"),
  phone: z.string().min(1, "Telefon numarası zorunludur"),
  role: z.enum(["customer", "restaurant_owner", "courier", "admin"]),
});

export const loginSchema = z.object({
  email: z.email(
    "Kullanıcı adı veya şifre hatalı lütfen bilgilerinizi kontrol ediniz"
  ),
  password: z
    .string()
    .min(
      6,
      "Kullanıcı adı veya şifre hatalı lütfen bilgilerinizi kontrol ediniz"
    ),
});

// Şemalar üzerinden tip çıkarabiliriz
export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

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
