import z from "zod"

//

const envSchema = z.object({
    NODE_ENV: z.string(),

    NUXT_DB_DIALECT: z.string(),
    NUXT_DB_USER: z.string(),
    NUXT_DB_PASSWORD: z.string(),
    NUXT_DB_HOST: z.string(),
    NUXT_DB_PORT: z.coerce.number().int(),
    NUXT_DB_NAME: z.string(),
    NUXT_DB_URL: z.string(),
    
    NUXT_DEV_EMAIL: z.string(),
    
    NUXT_GMAIL_ADDRESS: z.string(),
    NUXT_GMAIL_PASSWORD: z.string(),
    
    NUXT_CLOUDINARY_API_KEY: z.string(),
    NUXT_CLOUDINARY_API_NAME: z.string(),
    NUXT_CLOUDINARY_API_SECRET: z.string(),
    
    NUXT_JWT_ACCESS_LIFE: z.coerce.number().int(),
    NUXT_JWT_REFRESH_LIFE: z.coerce.number().int(),
    NUXT_JWT_RESET_LIFE: z.coerce.number().int(),
    NUXT_JWT_VERIFY_LIFE: z.coerce.number().int(),
    NUXT_JWT_MCU_LIFE: z.coerce.number().int(),
    NUXT_JWT_CAMERA_LIFE: z.coerce.number().int(),
    NUXT_JWT_GREENHOUSE_LIFE: z.coerce.number().int(),
    
    NUXT_JWT_ACCESS_SECRET: z.string(),
    NUXT_JWT_REFRESH_SECRET: z.string(),
    NUXT_JWT_RESET_SECRET: z.string(),
    NUXT_JWT_VERIFY_SECRET: z.string(),
    NUXT_JWT_MCU_SECRET: z.string(),
    NUXT_JWT_CAMERA_SECRET: z.string(),
    NUXT_JWT_GREENHOUSE_SECRET: z.string(),
})

// --- Scope & In-case I/you forgot something

export default envSchema.parse(process.env)