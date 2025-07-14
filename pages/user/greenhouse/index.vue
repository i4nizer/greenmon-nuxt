<template>
    <v-container class="pa-5 py-7" fluid>
        <v-row>
            <v-col>
                <h3>User Greenhouse</h3>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="text-end">
                <v-dialog class="w-100 w-md-50" v-model="createDialog">
                    <template #activator="{ props: activatorProps }">
                        <v-btn class="bg-green" :="activatorProps">
                            <v-icon class="mr-1">mdi-plus</v-icon>
                            <span v-if="$vuetify.display.smAndUp">New Greenhouse</span>
                        </v-btn>
                    </template>
                    <template #default>
                        <UserGreenhouseCreateForm 
                            :error="createError"
                            :loading="createLoading"
                            @submit="createGreenhouse"
                        />
                    </template>
                </v-dialog>
            </v-col>
        </v-row>
        <v-row>
            <!-- Single Edit Dialog -->
            <v-col class="position-absolute">
                <v-dialog class="w-100 w-md-50" v-model="updateDialog">
                    <UserGreenhouseUpdateForm
                        :error="updateError"
                        :loading="updateLoading"
                        :greenhouse="updateData"
                        @submit="updateGreenhouse"
                    />
                </v-dialog>
            </v-col>
            <!-- Greenhouse List -->
            <v-col v-for="greenhouse in greenhouses" cols="12" xs="12" sm="6" md="4" lg="3" xl="2">
                <UserGreenhouseCard 
                    :loading="greenhouseCardLoadingIds.includes(greenhouse.id)"
                    :greenhouse
                    @view="viewGreenhouse"
                    @edit="editGreenhouse"
                    @delete="deleteGreenhouse"
                />
            </v-col>
            <!-- Fallback/emptystate when no greenhouse -->
            <v-col v-if="!greenhouses.length">
                <v-empty-state
                    icon="mdi-sprout"
                    text="You haven't created any greenhouse yet."
                    title="No greenhouse yet"
                ></v-empty-state>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import type { Greenhouse, GreenhouseCreate, GreenhouseUpdate } from '~/shared/schema/greenhouse';

//

// --- Fetch Greenhouses
const { data } = await useFetch("/api/user/greenhouse", { lazy: true })
const greenhouses = reactive<Greenhouse[]>([...((data.value as Greenhouse[]) ?? [])])

// --- Card Loading Indicator
const greenhouseCardLoadingIds = reactive<number[]>([])

// --- Greenhouse Creation
const createError = ref<string>()
const createDialog = ref(false)
const createLoading = ref(false)

const createGreenhouse = async (data: GreenhouseCreate) => {
    createError.value = undefined
    createLoading.value = true

    await $fetch("/api/user/greenhouse", { method: "POST", body: data })
        .then(res => greenhouses.push({
            ...res,
            createdAt: new Date(res.createdAt),
            updatedAt: new Date(res.updatedAt)
        }))
        .catch(err => createError.value = err?.statusMessage ?? "Something went wrong.")

    createDialog.value = false
    createLoading.value = false
}

// --- Greenhouse Update
const updateData = ref<GreenhouseUpdate>({ id: -1, name: "", description: "" })
const updateError = ref<string>()
const updateDialog = ref(false)
const updateLoading = ref(false)

const updateGreenhouse = async (data: GreenhouseUpdate) => {
    updateError.value = undefined
    updateLoading.value = true
    greenhouseCardLoadingIds.push(data.id)

    await $fetch(`/api/user/greenhouse/${data.id}`, { method: "PATCH", body: data })
        .then(res => {
            const gh = greenhouses.find(g => g.id == res.id)
            if (gh) Object.assign(gh, res)
        })
        .catch(err => updateError.value = err?.statusMessage ?? "Something went wrong.")

    updateDialog.value = false
    updateLoading.value = false
    const idx = greenhouseCardLoadingIds.findIndex(i => i == data.id)
    if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

// --- Greenhouse Card Navigations
const viewGreenhouse = async (id: number) => {
    greenhouseCardLoadingIds.push(id)
    await navigateTo(`/user/greenhouse/${id}/mcu`)
    const idx = greenhouseCardLoadingIds.findIndex(i => i == id)
    if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

const editGreenhouse = (greenhouse: Greenhouse) => {
    updateData.value = greenhouse
    updateDialog.value = true
}

const deleteGreenhouse = async (id: number) => {
    greenhouseCardLoadingIds.push(id)

    await $fetch(`/api/user/greenhouse/${id}`, { method: "DELETE" })
        .then(() => greenhouses.findIndex(g => g.id == id))
        .then(idx => idx != -1 && greenhouses.splice(idx, 1))
        .catch(console.error)

    const idx = greenhouseCardLoadingIds.findIndex(i => i == id)
    if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

//

</script>

<style scoped>

</style>