import type { VuetifyModuleOptions } from "vuetify-nuxt-module";

//

export default <VuetifyModuleOptions>{
    moduleOptions: {},
    vuetifyOptions: {
        defaults: {
            VBtn: { class: 'text-none' },
            VTextField: { variant: 'outlined', density: 'compact', class: 'mt-1' },
            VNumberInput: { variant: 'outlined', density: 'compact', class: 'mt-1' },
            VSelect: { variant: 'outlined', density: 'compact', class: 'mt-1' },
            VTextarea: { variant: 'outlined', density: 'compact', class: 'mt-1' },
        },
        labComponents: [
            'VTimePicker',
            'VFileUpload',
        ]
    }
}