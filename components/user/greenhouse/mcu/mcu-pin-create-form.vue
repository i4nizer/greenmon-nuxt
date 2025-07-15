<template>
    <VeeForm
        class="bg-green-darken-4 pa-7"
        :initial-values="{ type: 'Digital', mode: 'Unset', number: -1 }"
        :validation-schema
        #="{ meta }"
        @submit="create"
    >
        <h3>Create Mcu</h3>
        <span class="text-grey">Please provide the pin details.</span>
        <v-alert
            v-if="error"
            type="error"
            class="my-2"
            :title="error"
        ></v-alert>
        <VeeField name="type" #="{ field, errorMessage }">
            <v-select
                label="Type"
                class="mt-6"
                aria-autocomplete="both"
                v-model="field.value"
                :="field"
                :items="['Digital', 'Analog']"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-select>
        </VeeField>
        <VeeField name="mode" #="{ field, errorMessage }">
            <v-select
                label="Mode"
                aria-autocomplete="both"
                v-model="field.value"
                :="field"
                :items="['Unset', 'Input', 'Output', 'Other']"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-select>
        </VeeField>
        <VeeField name="number" #="{ field, errorMessage }">
            <v-number-input
                type="number"
                label="Number"
                aria-autocomplete="both"
                :="field"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-number-input>
        </VeeField>
        <v-btn 
            type="submit" 
            text="Create" 
            color="green"
            class="w-100 mt-3" 
            :loading
            :disabled="!meta.valid || !meta.dirty"
        ></v-btn>
    </VeeForm>
</template>

<script setup lang="ts">
import { PinCreateSchema, type PinCreate } from '~/shared/schema/pin';

//

// --- Validation
const validationSchema = toTypedSchema(PinCreateSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [pin: PinCreate] }>()
const props = defineProps<{ error?: string, loading?: boolean }>()

// --- Pass Invoke
const create = (values: any) => emit("submit", values as PinCreate)

//

</script>

<style scoped>

</style>