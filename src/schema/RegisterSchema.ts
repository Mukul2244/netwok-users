import { z } from "zod"
export const RegisterSchema = z.object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(32, { message: "Username is too long" }),
  
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(3, { message: "Email must be at least 3 characters" })
      .max(32, { message: "Email is too long" })
    , 
    restaurantId: z
    .number(),
    qrCodeNumber: z
    .number() 
  })