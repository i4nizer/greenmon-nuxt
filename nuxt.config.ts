import envConfig from "./env.config";
import vuetifyConfig from "./vuetify.config";

//

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: [
    "@nuxt/image",
    "@prisma/nuxt",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "vuetify-nuxt-module",
  ],
  imports: {
    imports: [
      { from: "vuetify/labs/rules", name: "useRules" }
    ]
  },
  runtimeConfig: {
    ...envConfig,
  },
  prisma: {
    runMigration: false,
    installStudio: false,
    generateClient: false,
  },
  vuetify: {
    ...vuetifyConfig
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
})
