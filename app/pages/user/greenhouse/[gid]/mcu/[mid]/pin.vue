<template>
	<v-container class="pa-5 py-7" fluid>
		<v-row>
			<v-col>
				<h3>Microcontroller Pins</h3>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12" class="text-end">
				<!-- Pin Create Button -->
				<v-dialog class="w-100 w-md-50">
					<template #activator="{ props: activatorProps }">
						<v-btn class="bg-green" :="activatorProps">
							<v-icon class="mr-1">mdi-plus</v-icon>
							<span v-if="$vuetify.display.smAndUp">New Pin</span>
						</v-btn>
					</template>
					<template #default="{ isActive }">
						<McuPinCreateForm 
							:gid
							:mid
							@success="isActive.value = false"
						/>
					</template>
				</v-dialog>
				<!-- Hidden Single Update Dialog -->
				<v-dialog class="w-100 w-md-50" v-model="updateDialog">
					<template #default="{ isActive }">
						<McuPinUpdateForm 
							:gid
							:mid
							:pin="updateData" 
							@success="isActive.value = false"
						/>
					</template>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<v-col cols="12">
				<!-- Mcu Pins Table -->
				<McuPinsTable 
					:gid
					:mid
					:pins="pins ?? []" 
					@edit="onEditPin" 
					@error="onErrorPin"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import z from "zod"
import type { Pin, PinCreate, PinUpdate } from "~~/shared/schema/pin"

//

// --- Notif
const { append: appendSnack } = useSnackbarStore()

// --- Use Route Params
const route = useRoute()
const paramSchema = z.object({ gid: z.coerce.number(), mid: z.coerce.number() })
const { gid, mid } = paramSchema.parse(route.params)

// --- Fetch Mcu Pins
const { pins, hydratePin } = usePinStore()

const fetchPins = async () => {
	const { error } = await hydratePin(gid, mid)
	if (error) appendSnack({ text: "Fetch pins failed.", color: "error" })
}

onBeforeMount(async () => await fetchPins())
onServerPrefetch(async () => await fetchPins())

// --- Pin Update
const updateData = ref<PinUpdate>({ id: -1, type: "Digital", mode: "Unset", number: -1 })
const updateDialog = ref(false)

const onEditPin = async (pin: Pin) => {
	updateData.value = pin
	updateDialog.value = true
}

// --- Display
const onErrorPin = (error: string) => {
	appendSnack({ text: error, color: "error" })
}

//
</script>

<style scoped></style>
