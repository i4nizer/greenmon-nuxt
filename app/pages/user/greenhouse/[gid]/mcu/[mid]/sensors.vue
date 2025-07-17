<template>
	<v-container class="pa-5 py-7" fluid>
		<v-row>
			<v-col>
				<h3>Microcontroller Sensors</h3>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="text-end">
				<!-- Sensor Create Button -->
				<v-dialog class="w-100 w-md-50" v-model="createDialog">
					<template #activator="{ props: activatorProps }">
						<v-btn class="bg-green" :="activatorProps">
							<v-icon class="mr-1">mdi-plus</v-icon>
							<span v-if="$vuetify.display.smAndUp">New Sensor</span>
						</v-btn>
					</template>
					<template #default>
						<McuSensorCreateForm :error="createError" :loading="createLoading" @submit="createSensor" />
					</template>
				</v-dialog>
				<!-- Hidden Single Update Dialog -->
				<v-dialog class="w-100 w-md-50" v-model="updateDialog">
					<McuSensorUpdateForm
						:sensor="updateData"
						:error="updateError"
						:loading="updateLoading"
						@submit="updateSensor"
					/>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<!-- Sensor Lists -->
			<v-col v-for="sensor in sensors" cols="12" sm="12" lg="6" xxl="4">
				<McuSensorCard :sensor :loading="sensorCardLoadingIds.includes(sensor.id)">
					<template #menu>
						<McuSensorCardMenu :sensor @edit="editSensor" @delete="deleteSensor" @toggle="toggleSensor">
							<template #activator="{ props: menuProps }">
								<v-btn icon="mdi-dots-vertical" size="small" color="white" elevation="0" :="menuProps"></v-btn>
							</template>
						</McuSensorCardMenu>
					</template>
				</McuSensorCard>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import type { Sensor, SensorCreate, SensorUpdate } from "~~/shared/schema/sensor"

//

// --- Notif
const { append: appendMsg } = useSnackbarStore()

// --- Use Route Params
const route = useRoute()
const { gid, mid } = route.params

// --- Fetch Mcu Sensors
const headers = useRequestHeaders(["cookie"])
const { data: sensors, refresh } = await useFetch<Sensor[]>(
	`/api/user/greenhouse/${gid}/mcu/${mid}/sensor`,
	{ headers, lazy: true, deep: true }
)

onBeforeMount(async () =>
	await refresh()
		.catch(() => appendMsg({ text: "Fetch greenhouse failed.", color: "error" }))
)

// --- Sensor Card State
const sensorCardLoadingIds = reactive<number[]>([])

// --- Sensor Creation
const createError = ref<string>()
const createDialog = ref(false)
const createLoading = ref<boolean>()

const createSensor = async (sensor: SensorCreate) => {
	createError.value = undefined
	createLoading.value = true

	await $fetch<Sensor>(`/api/user/greenhouse/${gid}/mcu/${mid}/sensor`, { method: "POST", body: sensor })
		.then((res) => sensors.value?.push(res))
		.catch((err) => (createError.value = err?.statusMessage ?? "Something went wrong."))

	createDialog.value = false
	createLoading.value = false
}

// --- Sensor Update
const updateData = ref<SensorUpdate>({ id: -1, name: "", label: "", interval: -1, disabled: true })
const updateError = ref<string>()
const updateDialog = ref(false)
const updateLoading = ref<boolean>()

const updateSensor = async (sensor: SensorUpdate) => {
	updateError.value = undefined
	updateLoading.value = true

	await $fetch<Sensor[]>(`/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sensor.id}`, { method: "PATCH", body: sensor })
		.then((res) => ({ sensor: sensors.value?.find((p) => p.id == sensor.id), res }))
		.then(({ sensor, res }) => sensor && Object.assign(sensor, res))
		.catch((err) => (updateError.value = err?.statusMessage ?? "Something went wrong."))

	updateDialog.value = false
	updateLoading.value = false
}

// --- Sensor Menu
const editSensor = (sensor: Sensor) => {
	updateData.value = sensor
	updateDialog.value = true
}

const deleteSensor = async (id: number) => {
	sensorCardLoadingIds.push(id)

	await $fetch(`/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${id}`, { method: "DELETE" })
		.then(() => sensors.value?.findIndex((s) => s.id == id))
		.then((idx) => idx && idx != -1 && sensors.value?.splice(idx, 1))
		.catch(() => appendMsg({ text: "Delete sensor failed.", color: "error" }))

	const idx = sensorCardLoadingIds.findIndex((i) => i == id)
	if (idx != -1) sensorCardLoadingIds.splice(idx, 1)
}

const toggleSensor = async (sensor: Sensor) => {
	sensorCardLoadingIds.push(sensor.id)
	sensor.disabled = !sensor.disabled

	await $fetch(`/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sensor.id}`, { method: "PATCH", body: sensor })
		.then((res) => ({ sensor: sensors.value?.find((s) => s.id == sensor.id), res }))
		.then(({ res, sensor }) => sensor && Object.assign(sensor, res))
		.catch(() => appendMsg({ text: "Update sensor failed.", color: "error" }))

	const idx = sensorCardLoadingIds.findIndex((i) => i == sensor.id)
	if (idx != -1) sensorCardLoadingIds.splice(idx, 1)
}

//
</script>

<style scoped></style>
