import { z } from "zod"

//

const UserSchema = z.object({
    id: z.number().int(),
    name: z.string().min(1).max(128),
    email: z.string().email(),
    phone: z.string(),
    password: z.string().min(8).max(128),
    verified: z.boolean(),
    disabled: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

//

export { UserSchema }