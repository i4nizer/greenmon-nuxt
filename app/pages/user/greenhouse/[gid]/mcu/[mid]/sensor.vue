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
				<v-dialog class="w-100 w-md-50">
					<template #activator="{ props: activatorProps }">
						<v-btn class="bg-green" :="activatorProps">
							<v-icon class="mr-1">mdi-plus</v-icon>
							<span v-if="$vuetify.display.smAndUp">New Sensor</span>
						</v-btn>
					</template>
					<template #default="{ isActive }">
						<McuSensorCreateForm 
							:gid
							:mid
							@success="isActive.value = false"
						/>
					</template>
				</v-dialog>
				<!-- Hidden Single Update Dialog -->
				<v-dialog class="w-100 w-md-50" v-model="updateDialog">
					<template #default="{ isActive }">
						<McuSensorUpdateForm
							:gid
							:mid
							:sensor="updateData"
							@success="isActive.value = false"
						/>
					</template>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<!-- Sensor Lists -->
			<v-col v-for="sensor in sensors" cols="12" sm="12" lg="6" xxl="4">
				<McuSensorCard :sensor>
					<template #menu>
						<McuSensorCardMenu
							:gid
							:mid
							:sensor
							@edit="onEditSensor"
							@error="onErrorSensor"
						/>
					</template>
				</McuSensorCard>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import z from "zod"
import type { Sensor, SensorUpdate } from "~~/shared/schema/sensor"

//

// --- Notif
const { append: appendSnack } = useSnackbarStore()

// --- Use Route Params
const route = useRoute()
const paramSchema = z.object({ gid: z.coerce.number(), mid: z.coerce.number() })
const { gid, mid } = paramSchema.parse(route.params)

// --- Fetch Mcu Sensors
const { sensors, hydrateSensor } = useSensorStore()

const fetchSensors = async () => {
	const { error } = await hydrateSensor(gid, mid)
	if (error) appendSnack({ text: error, color: "error" })
}

onBeforeMount(async () => await fetchSensors())
onServerPrefetch(async () => await fetchSensors())

// --- Sensor Update
const updateData = ref<SensorUpdate>({ id: -1, name: "", label: "", interval: -1, disabled: true })
const updateDialog = ref(false)

const onEditSensor = (sensor: Sensor) => {
	updateData.value = sensor
	updateDialog.value = true
}

const onErrorSensor = (error: string) => {
	appendSnack({ text: error, color: "error" })
}

// ---

//
</script>

<style scoped></style>
