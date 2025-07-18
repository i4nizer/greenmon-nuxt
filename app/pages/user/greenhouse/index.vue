<template>
	<v-container class="pa-5 py-7" fluid>
		<v-row>
			<v-col>
				<h3>User Greenhouse</h3>
			</v-col>
		</v-row>
		<v-row>
			<v-col class="text-end">
				<v-dialog class="w-100 w-md-50">
					<template #activator="{ props: activatorProps }">
						<v-btn class="bg-green" :="activatorProps">
							<v-icon class="mr-1">mdi-plus</v-icon>
							<span v-if="$vuetify.display.smAndUp">New Greenhouse</span>
						</v-btn>
					</template>
					<template #default="{ isActive }">
						<UserGreenhouseCreateForm 
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
						<UserGreenhouseUpdateForm
							:greenhouse="(updateData as GreenhouseUpdate)"
							@success="isActive.value = false"
						/>
					</template>
				</v-dialog>
			</v-col>
			<!-- Greenhouse List -->
			<v-col 
				v-for="greenhouse in greenhouses" 
				cols="12" xs="12" sm="6" md="4" lg="3" xl="2"
				:key="greenhouse.id"
			>
				<UserGreenhouseCard
					:view-link="`/user/greenhouse/${greenhouse.id}/mcu`"
					:greenhouse
					@edit="onEditGreenhouse"
					@error="onErrorGreenhouse"
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
import type { Greenhouse, GreenhouseUpdate } from "~~/shared/schema/greenhouse"

//

// --- Notif
const { append: appendSnack } = useSnackbarStore()

// --- Fetch Greenhouses
const {
	greenhouses,
	hydrateGreenhouse,
} = useGreenhouseStore()

const fetchGreenhouse = async () => {
	const { error } = await hydrateGreenhouse()
	if (error) appendSnack({ text: error, color: "error" })
}

onBeforeMount(async () => await fetchGreenhouse())
onServerPrefetch(async () => await fetchGreenhouse())

// --- Greenhouse Update
const updateData = ref<GreenhouseUpdate | undefined>(undefined)
const updateDialog = ref(false)

const onEditGreenhouse = (greenhouse: Greenhouse) => {
	updateData.value = greenhouse
	updateDialog.value = true
}

// --- Display
const onErrorGreenhouse = (error: string) => {
	appendSnack({ text: error, color: 'error' })
}

//
</script>

<style scoped></style>
