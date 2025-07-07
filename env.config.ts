export default {
    dbDialect: process.env.NUXT_DB_DIALECT,
    dbUser: process.env.NUXT_DB_USER,
    dbPassword: process.env.NUXT_DB_PASSWORD,
    dbHost: process.env.NUXT_DB_HOST,
    dbPort: parseInt(process.env.NUXT_DB_PORT || "3306"),
    dbName: process.env.NUXT_DB_NAME,
    dbUrl: process.env.NUXT_DB_URL,

    devEmail: process.env.NUXT_DEV_EMAIL,

    gmailAddress: process.env.NUXT_GMAIL_ADDRESS,
    gmailPassword: process.env.NUXT_GMAIL_PASSWORD,

    cloudinaryApiKey: process.env.NUXT_CLOUDINARY_API_KEY,
    cloudinaryApiName: process.env.NUXT_CLOUDINARY_API_NAME,
    cloudinaryApiSecret: process.env.NUXT_CLOUDINARY_API_SECRET,

    jwtAccessLife: parseInt(process.env.NUXT_JWT_ACCESS_LIFE || "0"),
    jwtRefreshLife: parseInt(process.env.NUXT_JWT_REFRESH_LIFE || "0"),
    jwtMcuLife: parseInt(process.env.NUXT_JWT_MCU_LIFE || "0"),
    jwtCameraLife: parseInt(process.env.NUXT_JWT_CAMERA_LIFE || "0"),
    jwtGreenhouseLife: parseInt(process.env.NUXT_JWT_GREENHOUSE_LIFE || "0"),
    
    jwtAccessSecret: process.env.NUXT_JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.NUXT_JWT_REFRESH_SECRET,
    jwtResetSecret: process.env.NUXT_JWT_RESET_SECRET,
    jwtVerifySecret: process.env.NUXT_JWT_VERIFY_SECRET,
    jwtMcuSecret: process.env.NUXT_JWT_MCU_SECRET,
    jwtCameraSecret: process.env.NUXT_JWT_CAMERA_SECRET,
    jwtGreenhouseSecret: process.env.NUXT_JWT_GREENHOUSE_SECRET,

    public: {
        jwtResetLife: parseInt(process.env.NUXT_JWT_RESET_LIFE || "0"),
        jwtVerifyLife: parseInt(process.env.NUXT_JWT_VERIFY_LIFE || "0"),
    }
}