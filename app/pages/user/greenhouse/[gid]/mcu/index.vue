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
						<GreenhouseMcuCreateForm :error="createError" :loading="createLoading" @submit="onCreateMcu" />
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
						@submit="onUpdateMcu"
					/>
				</v-dialog>
			</v-col>
			<!-- Greenhouse List -->
			<v-col v-for="mcu in mcus" cols="12" xs="12" sm="6" md="4" lg="3" xl="2">
				<GreenhouseMcuCard
					:mcu
					:loading="mcuCardLoadingIds.includes(mcu.id)"
					@view="onViewMcu"
					@edit="onEditMcu"
					@delete="onDeleteMcu"
				/>
			</v-col>
			<!-- Fallback/emptystate when no mcu -->
			<v-col v-if="!mcus || !mcus.length">
				<v-empty-state icon="mdi-chip" text="You haven't created any mcu yet." title="No mcu yet"></v-empty-state>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import z from "zod"
import type { Mcu, McuCreate, McuUpdate } from "~~/shared/schema/mcu"

//

// --- Auth for Prefix
const { user } = useAuthStore()

// --- Notif
const { append: appendMsg } = useSnackbarStore()

// --- Transform Route Params
const route = useRoute()
const paramsSchema = z.object({ gid: z.coerce.number() })
const { gid } = paramsSchema.parse(route.params)

// --- Fetch Mcus
const {
	mcus,
	hydrateMcu,
	createMcu,
	updateMcu,
	deleteMcu
} = useMcu(`${user.id}-${gid}-mcus`)

const fetchMcus = async () => {
	const { error } = await hydrateMcu(gid)
	if (error) appendMsg({ text: error, color: "error" })
}

onBeforeMount(async () => await fetchMcus())
onServerPrefetch(async () => await fetchMcus())

// --- Card Loading Indicator
const mcuCardLoadingIds = reactive<number[]>([])

// --- Mcu Creation
const createError = ref<string>()
const createDialog = ref(false)
const createLoading = ref(false)

const onCreateMcu = async (data: McuCreate) => {
	createError.value = undefined
	createLoading.value = true

	const { error } = await createMcu(gid, data)
	createError.value = error

	createDialog.value = false
	createLoading.value = false
}

// --- Mcu Update
const updateData = ref<McuUpdate>({ id: -1, name: "", label: "" })
const updateError = ref<string>()
const updateDialog = ref(false)
const updateLoading = ref(false)

const onUpdateMcu = async (data: McuUpdate) => {
	updateError.value = undefined
	updateLoading.value = true
	mcuCardLoadingIds.push(data.id)

	const { error } = await updateMcu(gid, data)
	updateError.value = error

	updateDialog.value = false
	updateLoading.value = false
	const idx = mcuCardLoadingIds.findIndex((i) => i == data.id)
	if (idx != -1) mcuCardLoadingIds.splice(idx, 1)
}

// --- Mcu Card Navigations
const onViewMcu = async (id: number) => {
	mcuCardLoadingIds.push(id)
	await navigateTo(`/user/greenhouse/${gid}/mcu/${id}/pins`)
	const idx = mcuCardLoadingIds.findIndex((i) => i == id)
	if (idx != -1) mcuCardLoadingIds.splice(idx, 1)
}

const onEditMcu = (mcu: Mcu) => {
	updateData.value = mcu
	updateDialog.value = true
}

const onDeleteMcu = async (id: number) => {
	mcuCardLoadingIds.push(id)

	const { error } = await deleteMcu(gid, id)
	if (error) appendMsg({ text: error, color: "error" })

	const idx = mcuCardLoadingIds.findIndex((i) => i == id)
	if (idx != -1) mcuCardLoadingIds.splice(idx, 1)
}

//
</script>

<style scoped></style>
