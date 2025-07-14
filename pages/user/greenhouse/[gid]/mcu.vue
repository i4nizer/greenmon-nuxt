<template>
    <v-container class="pa-5 py-7" fluid>
        <v-row>
            <v-col>
                <h3>Greenhouse Microcontrollers</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end">
                <v-dialog class="w-100 w-md-50" v-model="createDialog">
                    <template #activator="{ props: activatorProps }">
                        <v-btn class="bg-green" :="activatorProps">
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">New Microcontroller</span>
                        </v-btn>
                    </template>
                    <template #default>
                        <GreenhouseMcuCreateForm 
                            :error="createError"
                            :loading="createLoading"
                            @submit="createMcu"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Single Edit Dialog -->
            <v-col class="position-absolute">
                <v-dialog class="w-100 w-md-50" v-model="updateDialog">
                    <GreenhouseMcuUpdateForm
                        :mcu="updateData"
                        :error="updateError"
                        :loading="updateLoading"
                        @submit="updateMcu"
                    />
                </v-dialog>
            </v-col>
            <!-- Greenhouse List -->
            <v-col v-for="mcu in mcus" cols="12" xs="12" sm="6" md="4" lg="3" xl="2">
                <GreenhouseMcuCard 
                    :mcu
                    :loading="mcuCardLoadingIds.includes(mcu.id)"
                    @view="viewMcu"
                    @edit="editMcu"
                    @delete="deleteMcu"
                />
            </v-col>
            <!-- Fallback/emptystate when no mcu -->
            <v-col v-if="!mcus.length">
                <v-empty-state
                    icon="mdi-chip"
                    text="You haven't created any mcu yet."
                    title="No mcu yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Mcu, McuCreate, McuUpdate } from '~/shared/schema/mcu';

//

// --- Fetch Mcus
const route = useRoute()
const { gid } = route.params
const { data } = await useFetch(`/api/user/greenhouse/${gid}/mcu`, { lazy: true })
const mcus = reactive<Mcu[]>([...((data.value as Mcu[]) ?? [])])

// --- Card Loading Indicator
const mcuCardLoadingIds = reactive<number[]>([])

// --- Mcu Creation
const createError = ref<string>()
const createDialog = ref(false)
const createLoading = ref(false)

const createMcu = async (data: McuCreate) => {
    createError.value = undefined
    createLoading.value = true

    await $fetch(`/api/user/greenhouse/${gid}/mcu`, { method: "POST", body: data })
        .then(res => mcus.push({
            ...res,
            createdAt: new Date(res.createdAt),
            updatedAt: new Date(res.updatedAt)
        }))
        .catch(err => createError.value = err?.statusMessage ?? "Something went wrong.")

    createDialog.value = false
    createLoading.value = false
}

// --- Mcu Update
const updateData = ref<McuUpdate>({ id: -1, name: "", label: "" })
const updateError = ref<string>()
const updateDialog = ref(false)
const updateLoading = ref(false)

const updateMcu = async (data: McuUpdate) => {
    updateError.value = undefined
    updateLoading.value = true
    mcuCardLoadingIds.push(data.id)

    await $fetch(`/api/user/greenhouse/${gid}/mcu/${data.id}`, { method: "PATCH", body: data })
        .then(res => {
            const gh = mcus.find(g => g.id == res.id)
            if (gh) Object.assign(gh, res)
        })
        .catch(err => updateError.value = err?.statusMessage ?? "Something went wrong.")

    updateDialog.value = false
    updateLoading.value = false
    const idx = mcuCardLoadingIds.findIndex(i => i == data.id)
    if (idx != -1) mcuCardLoadingIds.splice(idx, 1)
}

// --- Mcu Card Navigations
const viewMcu = async (id: number) => {
    mcuCardLoadingIds.push(id)
    await navigateTo(`/user/greenhouse/${gid}/mcu/${id}/dashboard`)
    const idx = mcuCardLoadingIds.findIndex(i => i == id)
    if (idx != -1) mcuCardLoadingIds.splice(idx, 1)
}

const editMcu = (mcu: Mcu) => {
    updateData.value = mcu
    updateDialog.value = true
}

const deleteMcu = async (id: number) => {
    mcuCardLoadingIds.push(id)

    await $fetch(`/api/user/greenhouse/${gid}/mcu/${id}`, { method: "DELETE" })
        .then(() => mcus.findIndex(g => g.id == id))
        .then(idx => idx != -1 && mcus.splice(idx, 1))
        .catch(console.error)

    const idx = mcuCardLoadingIds.findIndex(i => i == id)
    if (idx != -1) mcuCardLoadingIds.splice(idx, 1)
}

//

</script>

<style scoped>

</style>