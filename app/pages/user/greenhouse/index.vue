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
						<UserGreenhouseCreateForm :error="createError" :loading="createLoading" @submit="createGreenhouse" />
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
			<v-col 
				v-for="greenhouse in greenhouses" 
				cols="12" xs="12" sm="6" md="4" lg="3" xl="2"
				:key="greenhouse.id"
			>
				<UserGreenhouseCard
					:loading="greenhouseCardLoadingIds.includes(greenhouse.id)"
					:greenhouse
					@view="viewGreenhouse"
					@edit="editGreenhouse"
					@delete="deleteGreenhouse"
				/>
			</v-col>
			<!-- Fallback/emptystate when no greenhouse -->
			<v-col v-if="!greenhouses || !greenhouses.length">
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
import type { Greenhouse, GreenhouseCreate, GreenhouseUpdate } from "~~/shared/schema/greenhouse"

//

// --- Notif
const { append: appendMsg } = useSnackbarStore()

// --- Fetch Greenhouses
const headers = useRequestHeaders(["cookie"])
const { data: greenhouses, refresh } = await useFetch<Greenhouse[]>(
	"/api/user/greenhouse",
	{ headers, lazy: true, deep: true }
)

onBeforeMount(async () =>
	await refresh()
		.catch(() => appendMsg({ text: "Fetch greenhouse failed.", color: "error" }))
)

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
		.then((res) => ({ ...res, createdAt: new Date(res.createdAt), updatedAt: new Date(res.updatedAt) }))
		.then((gh) => greenhouses.value?.push(gh))
		.catch((err) => (createError.value = err?.statusMessage ?? "Something went wrong."))

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
		.then((res) => ({ gh: greenhouses.value?.find((g) => g.id == res.id), res }))
		.then(({ gh, res }) => gh && Object.assign(gh, res))
		.catch((err) => (updateError.value = err?.statusMessage ?? "Something went wrong."))

	updateDialog.value = false
	updateLoading.value = false
	const idx = greenhouseCardLoadingIds.findIndex((i) => i == data.id)
	if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

// --- Greenhouse Card Navigations
const viewGreenhouse = async (id: number) => {
	greenhouseCardLoadingIds.push(id)
	await navigateTo(`/user/greenhouse/${id}/mcu`)
	const idx = greenhouseCardLoadingIds.findIndex((i) => i == id)
	if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

const editGreenhouse = (greenhouse: Greenhouse) => {
	updateData.value = greenhouse
	updateDialog.value = true
}

const deleteGreenhouse = async (id: number) => {
	greenhouseCardLoadingIds.push(id)

	await $fetch(`/api/user/greenhouse/${id}`, { method: "DELETE" })
		.then(() => greenhouses.value?.findIndex((g) => g.id == id))
		.then((idx) => idx && idx != -1 && greenhouses.value?.splice(idx, 1))
		.catch(() => appendMsg({ text: "Update greenhouse failed.", color: "error" }))

	const idx = greenhouseCardLoadingIds.findIndex((i) => i == id)
	if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

//
</script>

<style scoped></style>
