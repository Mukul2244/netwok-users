import { z } from "zod"
export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(32, { message: "Username is too long" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email must be at least 3 characters long" })
    .max(32, { message: "Email is too long" }),
  name: z
    .string()
    .optional(),
  description: z
    .string()
    .optional(),
  sex: z
  .enum(["M", "F", "O"], {
    required_error: "Please select your gender",
  }),
  interests: z
    .array(z.string())
    .optional(),

})