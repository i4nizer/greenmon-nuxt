<template>
    <VeeForm
        class="bg-green-darken-4 pa-7"
        :initial-values="greenhouse"
        :validation-schema
        #="{ meta }"
        @submit="update"
    >
        <h3>Update Greenhouse</h3>
        <span class="text-grey">Please provide the greenhouse details.</span>
        <v-alert
            v-if="error"
            type="error"
            class="my-2"
            :title="error"
        ></v-alert>
        <VeeField name="id" #="{ field }">
            <input type="hidden" :="field" :value="field.value">
        </VeeField>
        <VeeField name="name" #="{ field, errorMessage }">
            <v-text-field
                label="Name"
                class="mt-6"
                aria-autocomplete="both"
                v-model="field.value"
                :="field"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-text-field>
        </VeeField>
        <VeeField name="description" #="{ field, errorMessage }">
            <v-textarea
                label="Description"
                aria-autocomplete="both"
                v-model="field.value"
                :="field"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-textarea>
        </VeeField>
        <v-btn 
            type="submit" 
            text="Update" 
            color="green"
            class="w-100 mt-3" 
            :loading
            :disabled="!meta.valid || !meta.dirty"
        ></v-btn>
    </VeeForm>
</template>

<script setup lang="ts">
import { GreenhouseUpdateSchema, type GreenhouseUpdate } from '~/shared/schema/greenhouse';

//

// --- Validation
const validationSchema = toTypedSchema(GreenhouseUpdateSchema)

// --- Data Binding
const emit = defineEmits<{ submit: [greenhouse: GreenhouseUpdate] }>()
const props = defineProps<{ greenhouse: GreenhouseUpdate, error?: string, loading?: boolean }>()

// --- Pass Invoke
const update = (values: any) => emit("submit", values as GreenhouseUpdate)

//

</script>

<style scoped>

</style>