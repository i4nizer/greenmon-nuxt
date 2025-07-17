<template>
	<v-card class="border pt-3" :id="`sensor-${sensor?.id}`">
		<v-card-title class="d-flex ga-1 text-wrap">
			<span :class="sensor?.disabled ? 'text-red' : 'text-green'">{{ sensor?.name }}</span>
			<v-spacer></v-spacer>
			<!-- Menu -->
			<slot name="menu" :="{ sensor }"></slot>
		</v-card-title>
		<v-card-subtitle class="text-wrap">Label: {{ sensor?.label }}</v-card-subtitle>
		<v-card-text>
			<span class="w-100 text-wrap">Read Interval: Every {{ sensor?.interval }} seconds</span>
			<!-- Output Lists -->
			<slot name="output" :="{ sensor }"></slot>
			<!-- Hook Lists -->
			<slot name="hook" :="{ sensor }"></slot>
		</v-card-text>
	</v-card>
</template>

<script setup lang="ts">
import type { Sensor } from "~~/shared/schema/sensor"

//

// --- Data Binding
const props = defineProps<{ sensor: Sensor }>()

//
</script>

<style scoped></style>
