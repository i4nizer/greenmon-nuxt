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
							@submit="onCreateGreenhouse"
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
						:greenhouse="(updateData as GreenhouseUpdate)"
						@submit="onUpdateGreenhouse"
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
					@view="onViewGreenhouse"
					@edit="onEditGreenhouse"
					@delete="onDeleteGreenhouse"
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

// --- Auth for Prefix
const { user } = useAuthStore()

// --- Notif
const { append: appendMsg } = useSnackbarStore()

// --- Fetch Greenhouses
const {
	greenhouses,
	hydrateGreenhouse,
	createGreenhouse,
	updateGreenhouse,
	deleteGreenhouse
} = useGreenhouse(`${user.id}-greenhouses`)

const fetchGreenhouse = async () => {
	const { error } = await hydrateGreenhouse()
	if (error) appendMsg({ text: error, color: "error" })
}

onBeforeMount(async () => await fetchGreenhouse())
onServerPrefetch(async () => await fetchGreenhouse())

// --- Card Loading Indicator
const greenhouseCardLoadingIds = reactive<number[]>([])

// --- Greenhouse Creation
const createError = ref<string>()
const createDialog = ref(false)
const createLoading = ref(false)

const onCreateGreenhouse = async (data: GreenhouseCreate) => {
	createError.value = undefined
	createLoading.value = true

	const { error } = await createGreenhouse(data)
	createError.value = error

	createDialog.value = !!error
	createLoading.value = false
}

// --- Greenhouse Update
const updateData = ref<GreenhouseUpdate | undefined>(undefined)
const updateError = ref<string>()
const updateDialog = ref(false)
const updateLoading = ref(false)

const onUpdateGreenhouse = async (data: GreenhouseUpdate) => {
	updateError.value = undefined
	updateLoading.value = true
	greenhouseCardLoadingIds.push(data.id)

	const { error } = await updateGreenhouse(data)
	updateError.value = error

	updateDialog.value = false
	updateLoading.value = false
	const idx = greenhouseCardLoadingIds.findIndex((i) => i == data.id)
	if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

// --- Greenhouse Card Navigations
const onViewGreenhouse = async (id: number) => {
	greenhouseCardLoadingIds.push(id)
	await navigateTo(`/user/greenhouse/${id}/mcu`)
	const idx = greenhouseCardLoadingIds.findIndex((i) => i == id)
	if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

const onEditGreenhouse = (greenhouse: Greenhouse) => {
	updateData.value = greenhouse
	updateDialog.value = true
}

const onDeleteGreenhouse = async (id: number) => {
	greenhouseCardLoadingIds.push(id)

	const { error } = await deleteGreenhouse(id)
	if (error) appendMsg({ text: error, color: "error" })

	const idx = greenhouseCardLoadingIds.findIndex((i) => i == id)
	if (idx != -1) greenhouseCardLoadingIds.splice(idx, 1)
}

//
</script>

<style scoped></style>
