import { z } from "zod"

export const verifySchema = z.object({
    otp: z
        .string()
        .length(6, { message: "code must be six digit" })
        
})