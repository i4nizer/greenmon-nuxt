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
				<!-- Hidden Sensor Update Dialog -->
				<v-dialog class="w-100 w-md-50" v-model="sensorUpdateDialog">
					<template #default="{ isActive }">
						<McuSensorUpdateForm
							:gid
							:mid
							:sensor="sensorUpdateData"
							@success="isActive.value = false"
						/>
					</template>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<!-- Hidden Output Create Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="outputCreateDialog">
				<template #default="{ isActive }">
					<SensorOutputCreateForm 
						:gid
						:mid
						:sid="outputCreateSensorId"
						:pins
						@success="isActive.value = false"
					/>
				</template>
			</v-dialog>
			<!-- Hidden Output Update Dialog -->
			<v-dialog class="w-100 w-md-50" v-model="outputUpdateDialog">
				<template #default="{ isActive }">
					<SensorOutputUpdateForm 
						:gid
						:mid
						:sid="outputUpdateSensorId"
						:pins
						:output="outputUpdateData"
						@success="isActive.value = false"
					/>
				</template>
			</v-dialog>
			<!-- Sensor Lists -->
			<v-col v-for="sensor in sensorsWithOutputs" cols="12" sm="12" lg="6" xxl="4">
				<!-- Main Displayed Card -->
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
					<template #output>
						<v-list>
							<v-list-subheader class="d-flex justify-end">
								<v-btn
									text="Add Output"
									color="white"
									class="border"
									elevation="0"
									@click="onClickAddOutput(sensor.id)"
								></v-btn>
							</v-list-subheader>
							<v-list-item v-for="output in sensor.outputs">
								<SensorOutputCard 
									:gid
									:mid
									:sid="sensor.id"
									:output
									:pins
									@edit="onEditOutput"
									@error="onErrorOutput"
								/>
							</v-list-item>
							<v-list-item v-if="!sensor.outputs.length" class="text-center">
								<span class="text-grey">No Outputs Yet</span>
							</v-list-item>
						</v-list>
					</template>
				</McuSensorCard>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import z from "zod"
import type { Sensor, SensorUpdate } from "~~/shared/schema/sensor"
import type { Output, OutputUpdate } from "~~/shared/schema/output"

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
const sensorUpdateData = ref<SensorUpdate>({ id: -1, name: "", label: "", interval: -1, disabled: true })
const sensorUpdateDialog = ref(false)

const onEditSensor = (sensor: Sensor) => {
	sensorUpdateData.value = sensor
	sensorUpdateDialog.value = true
}

const onErrorSensor = (error: string) => {
	appendSnack({ text: error, color: "error" })
}

// --- Fetch Mcu Sensors Outputs
const { outputs, hydrateOutput } = useOutputStore()

const fetchOutputs = async () => {
	const { error } = await hydrateOutput(gid, mid)
	if (error) appendSnack({ text: error, color: "error" })
}

onBeforeMount(async () => await fetchOutputs())
onServerPrefetch(async () => await fetchOutputs())

// --- Output Create
const outputCreateDialog = ref(false)
const outputCreateSensorId = ref(-1)

const onClickAddOutput = (sid: number) => {
	outputCreateDialog.value = true
	outputCreateSensorId.value = sid
}

// --- Output Update
const outputUpdateData = ref<OutputUpdate>({ id: -1, icon: "", name: "", unit: "", pinId: -1 })
const outputUpdateDialog = ref(false)
const outputUpdateSensorId = ref(-1)

const onEditOutput = (output: Output) => {
	outputUpdateData.value = output
	outputUpdateSensorId.value = output.sensorId
	outputUpdateDialog.value = true
}

const onErrorOutput = (error: string) => {
	appendSnack({ text: error, color: "error" })
}

// --- Mcu's Pins to bind for Output
const { pins, hydratePin } = usePinStore()

const fetchPins = async () => {
	const { error } = await hydratePin(gid, mid)
	if (error) appendSnack({ text: error, color: "error" })
}

onBeforeMount(async () => await fetchPins())
onServerPrefetch(async () => await fetchPins())

// --- Mapping outputs to their sensor
const sensorsWithOutputs = computed(() => sensors.map(s => ({ ...s, outputs: outputs.filter(o => o.sensorId == s.id) })))

//
</script>

<style scoped></style>
