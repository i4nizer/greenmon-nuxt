import envConfig from "./env.config";

//

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: [
    "@prisma/nuxt",
    "@pinia/nuxt",
    "vuetify-nuxt-module",
  ],
  imports: {
    imports: [
      { from: "vuetify/labs/rules", name: "useRules" }
    ]
  },
  runtimeConfig: {
    ...envConfig
  }
})
