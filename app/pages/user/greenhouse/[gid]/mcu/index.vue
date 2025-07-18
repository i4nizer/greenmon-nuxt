<template>
	<v-container class="pa-5 py-7" fluid>
		<v-row>
			<v-col>
				<h3>Greenhouse Microcontrollers</h3>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="text-end">
				<v-dialog class="w-100 w-md-50">
					<template #activator="{ props: activatorProps }">
						<v-btn class="bg-green" :="activatorProps">
							<v-icon class="mr-1">mdi-plus</v-icon>
							<span v-if="$vuetify.display.smAndUp">New Microcontroller</span>
						</v-btn>
					</template>
					<template #default="{ isActive }">
						<GreenhouseMcuCreateForm 
							:gid
							@success="isActive.value = false"
						/>
					</template>
				</v-dialog>
			</v-col>
		</v-row>
		<v-row>
			<!-- Single Edit Dialog -->
			<v-col class="position-absolute">
				<v-dialog class="w-100 w-md-50" v-model="updateDialog">
					<template #default="{ isActive }">
						<GreenhouseMcuUpdateForm
							:gid
							:mcu="updateData"
							@success="isActive.value = false"
						/>
					</template>
				</v-dialog>
			</v-col>
			<!-- Greenhouse List -->
			<v-col v-for="mcu in mcus" cols="12" xs="12" sm="6" md="4" lg="3" xl="2">
				<GreenhouseMcuCard
					:gid
					:mcu
					:view-link="`/user/greenhouse/${gid}/mcu/${mcu.id}/pin`"
					@edit="onEditMcu"
					@error="onErrorMcu"
				/>
			</v-col>
			<!-- Fallback/emptystate when no mcu -->
			<v-col v-if="!mcus || !mcus.length">
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
import z from "zod"
import type { Mcu, McuUpdate } from "~~/shared/schema/mcu"

//

// --- Notif
const { append: appendSnack } = useSnackbarStore()

// --- Transform Route Params
const route = useRoute()
const paramsSchema = z.object({ gid: z.coerce.number() })
const { gid } = paramsSchema.parse(route.params)

// --- Fetch Mcus
const { mcus, hydrateMcu } = useMcuStore()

const fetchMcus = async () => {
	const { error } = await hydrateMcu(gid)
	if (error) appendSnack({ text: error, color: "error" })
}

onBeforeMount(async () => await fetchMcus())
onServerPrefetch(async () => await fetchMcus())

// --- Mcu Update
const updateData = ref<McuUpdate>({ id: -1, name: "", label: "" })
const updateDialog = ref(false)

const onEditMcu = (mcu: Mcu) => {
	updateData.value = mcu
	updateDialog.value = true
}

// --- Display
const onErrorMcu = (error: string) => { 
	appendSnack({ text: error, color: "error" })
}

//
</script>

<style scoped></style>
