<template>
    <v-container class="pa-5 py-7" fluid>
        <v-row>
            <v-col>
                <h3>Microcontroller Pins</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end">
                <!-- Pin Create Button -->
                <v-dialog class="w-100 w-md-50" v-model="createDialog">
                    <template #activator="{ props: activatorProps }">
                        <v-btn class="bg-green" :="activatorProps">
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">New Pin</span>
                        </v-btn>
                    </template>
                    <template #default>
                        <McuPinCreateForm 
                            :error="createError"
                            :loading="createLoading"
                            @submit="createPin"
                        />
                    </template>
                </v-dialog>
                <!-- Hidden Single Update Dialog -->
                <v-dialog class="w-100 w-md-50" v-model="updateDialog">
                    <McuPinUpdateForm
                        :pin="updateData"
                        :error="updateError"
                        :loading="updateLoading"
                        @submit="updatePin"
                    />
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Mcu Pins Table -->
            <McuPinsTable
                :pins="(pins ?? [])"
                @edit="editPin"
                @delete="deletePin"
            />
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Pin, PinCreate, PinUpdate } from '~/shared/schema/pin';

//

// --- Notif
const { append: appendMsg } = useSnackbarStore()

// --- Use Route Params
const route = useRoute()
const { gid, mid } = route.params

// --- Fetch Mcu Pins
const headers = useRequestHeaders(["cookie"])
const { data: pins, refresh } = await useFetch<Pin[]>(`/api/user/greenhouse/${gid}/mcu/${mid}/pin`, { headers, lazy: true })

onBeforeMount(async () => await refresh().catch(() => appendMsg({ text: "Fetch greenhouse failed.", color: "error" })))

// --- Pin Creation
const createError = ref<string>()
const createDialog = ref(false)
const createLoading = ref<boolean>()

const createPin = async (pin: PinCreate) => {
    createError.value = undefined
    createLoading.value = true

    await $fetch<Pin[]>(`/api/user/greenhouse/${gid}/mcu/${mid}/pin`, { method: "POST", body: [pin] })
        .then(res => pins.value?.push(...res))
        .catch(err => createError.value = err?.statusMessage ?? "Something went wrong.")

    createDialog.value = false
    createLoading.value = false
}

// --- Pin Update
const updateData = ref<PinUpdate>({ id: -1, type: "Digital", mode: "Unset", number: -1 })
const updateError = ref<string>()
const updateDialog = ref(false)
const updateLoading = ref<boolean>()

const updatePin = async (pin: PinUpdate) => {
    updateError.value = undefined
    updateLoading.value = true

    await $fetch<Pin[]>(`/api/user/greenhouse/${gid}/mcu/${mid}/pin/${pin.id}`, { method: "PATCH", body: pin })
        .then(res => ({ pin: pins.value?.find(p => p.id == pin.id), res }))
        .then(({ pin, res }) => pin && Object.assign(pin, res))
        .catch(err => updateError.value = err?.statusMessage ?? "Something went wrong.")

    updateDialog.value = false
    updateLoading.value = false
}

// --- Pin Table Actions
// const pinTableKey
const pinTableLoading = ref(false)

const editPin = async (pin: Pin) => {
    updateData.value = pin
    updateDialog.value = true
    pinTableLoading.value = true
}

const deletePin = async (id: number) => {
    pinTableLoading.value = true

    await $fetch(`/api/user/greenhouse/${gid}/mcu/${mid}/pin/${id}`, { method: "DELETE" })
        .then(() => pins.value && (pins.value = pins.value.filter(p => p.id != id)))
        // .then(() => pins.value?.findIndex(p => p.id == id))
        // .then(idx => (idx && idx != -1) && pins.value?.splice(idx, 1))
        .catch(err => appendMsg({ text: err?.statusMessage ?? "Something went wrong.", color: "error" }))
console.log(pins.value)
    pinTableLoading.value = false
}

//

</script>

<style scoped>

</style>