import { z } from "zod";

export const eventFormSchema = z.object({
  title: z.string().min(3, "Title harus lebih dari 3 karakter"),
  description: z
    .string()
    .min(3, "Deskripsi harus lebih dari 3 karakter")
    .max(400, "Deskripsi harus kurang dari 400 karakter"),
  location: z
    .string()
    .min(3, "Lokasi harus lebih dari 3 karakter")
    .max(400, "Lokasi harus kurang dari 400 karakter"),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});
