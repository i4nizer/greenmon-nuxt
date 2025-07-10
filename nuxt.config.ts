import envConfig from "./env.config";
import vuetifyConfig from "./vuetify.config";

//

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
  },
  ],
  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "vuetify-nuxt-module",
  ],
  nitro: {
    preset: "node",
  },
  runtimeConfig: {
    ...envConfig,
    public: {
      NUXT_JWT_RESET_LIFE: envConfig.NUXT_JWT_RESET_LIFE,
      NUXT_JWT_VERIFY_LIFE: envConfig.NUXT_JWT_VERIFY_LIFE,
    },
  },
  vuetify: {
    ...vuetifyConfig,
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
});
