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
						<McuPinCreateForm :error="createError" :loading="createLoading" @submit="onCreatePin" />
					</template>
				</v-dialog>
				<!-- Hidden Single Update Dialog -->
				<v-dialog class="w-100 w-md-50" v-model="updateDialog">
					<McuPinUpdateForm :pin="updateData" :error="updateError" :loading="updateLoading" @submit="onUpdatePin" />
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<!-- Mcu Pins Table -->
			<McuPinsTable :pins="pins ?? []" @edit="onEditPin" @delete="onDeletePin" />
		</v-row>
	</v-container>
</template>

<script setup lang="ts">
import z from "zod"
import type { Pin, PinCreate, PinUpdate } from "~~/shared/schema/pin"

//

// --- Auth for Prefix
const { user } = useAuthStore()

// --- Notif
const { append: appendMsg } = useSnackbarStore()

// --- Use Route Params
const route = useRoute()
const paramSchema = z.object({ gid: z.coerce.number(), mid: z.coerce.number() })
const { gid, mid } = paramSchema.parse(route.params)

// --- Fetch Mcu Pins
const {
	pins,
	hydratePin,
	createPin,
	updatePin,
	deletePin
} = usePin(`${user.id}-${gid}-${mid}-pins`)

const fetchPins = async () => {
	const { error } = await hydratePin(gid, mid)
	if (error) appendMsg({ text: "Fetch pins failed.", color: "error" })
}

onBeforeMount(async () => await fetchPins())
onServerPrefetch(async () => await fetchPins())

// --- Pin Creation
const createError = ref<string>()
const createDialog = ref(false)
const createLoading = ref<boolean>()

const onCreatePin = async (data: PinCreate) => {
	createError.value = undefined
	createLoading.value = true

	const { error } = await createPin(gid, mid, data)
	createError.value = error

	createDialog.value = false
	createLoading.value = false
}

// --- Pin Update
const updateData = ref<PinUpdate>({ id: -1, type: "Digital", mode: "Unset", number: -1 })
const updateError = ref<string>()
const updateDialog = ref(false)
const updateLoading = ref<boolean>()

const onUpdatePin = async (data: PinUpdate) => {
	updateError.value = undefined
	updateLoading.value = true

	const { error } = await updatePin(gid, mid, data)
	updateError.value = error

	updateDialog.value = false
	updateLoading.value = false
}

// --- Pin Table Actions
const pinTableLoading = ref(false)

const onEditPin = async (pin: Pin) => {
	updateData.value = pin
	updateDialog.value = true
	pinTableLoading.value = true
}

const onDeletePin = async (id: number) => {
	pinTableLoading.value = true

	const { error } = await deletePin(gid, mid, id)
	if (error) appendMsg({ text: error, color: "error" })

	pinTableLoading.value = false
}

//
</script>

<style scoped></style>
