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

    jwtApiLife: parseInt(process.env.NUXT_JWT_API_LIFE || "0"),
    jwtResetLife: parseInt(process.env.NUXT_JWT_RESET_LIFE || "0"),
    jwtVerifyLife: parseInt(process.env.NUXT_JWT_VERIFY_LIFE || "0"),
    jwtWebSocketLife: parseInt(process.env.NUXT_JWT_WEBSOCKET_LIFE || "0"),
    
    jwtApiSecret: process.env.NUXT_JWT_API_SECRET,
    jwtResetSecret: process.env.NUXT_JWT_RESET_SECRET,
    jwtVerifySecret: process.env.NUXT_JWT_VERIFY_SECRET,
    jwtWebSocketSecret: process.env.NUXT_JWT_WEBSOCKET_SECRET,
}