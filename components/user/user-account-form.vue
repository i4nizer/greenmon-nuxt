<template>
    <VeeForm 
        :initial-values="{ ...model }"
        :validation-schema="validationSchema"
        #="{ meta }"
        @submit="save"
    >
        <v-alert
            v-if="props.error"
            type="error"
            class="my-2"
            :title="props.error"
        ></v-alert>
        <VeeField name="name" #="{ field, errorMessage }">
            <v-text-field
                label="Name"
                class="mt-6"
                aria-autocomplete="both"
                v-model="model.name"
                :="field"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-text-field>
        </VeeField>
        <VeeField name="email" #="{ field, errorMessage }">
            <v-text-field
                readonly
                label="Email"
                placeholder="example@email.com"
                aria-autocomplete="both"
                v-model="model.email"
                :="field"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-text-field>
        </VeeField>
        <VeeField name="phone" #="{ field, errorMessage }">
            <v-text-field
                label="Phone"
                placeholder="09105341892"
                aria-autocomplete="both"
                v-model="model.phone"
                :="field"
                :error-messages="errorMessage ? [errorMessage] : []"
            ></v-text-field>
        </VeeField>
        <v-btn 
            type="submit" 
            text="Save" 
            color="green"
            class="w-100 mt-3" 
            :loading="props.loading"
            :disabled="!meta.valid || !meta.dirty"
        ></v-btn>
    </VeeForm>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { UserSchema } from '~/shared/schema/user';

//

// --- Types & Validation
const UserAccountSchema = UserSchema.pick({ name: true, email: true, phone: true })
const validationSchema = toTypedSchema(UserAccountSchema)
type UserAccount = z.infer<typeof UserAccountSchema>

// --- Data Binding
const emit = defineEmits<{ submit: [user: UserAccount] }>()
const model = defineModel<UserAccount>("user", { required: true })
const props = defineProps<{ error?: string, loading?: boolean }>()

// --- Pass Invoke
const save = (values: any) => emit("submit", values as UserAccount)

//

</script>

<style scoped>

</style>