import { z } from "zod"

export const userDataValideter = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must not exceed 20 characters" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(20, { message: "Password must not exceed 20 characters" })
        .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must include at least one number" })
        .regex(/[@$!%*?&#]/, { message: "Password must include at least one special character (@, $, !, %, *, ?, &, #)" })
        .refine((value) => !/\s/.test(value), { message: "Password must not contain spaces" }),
});