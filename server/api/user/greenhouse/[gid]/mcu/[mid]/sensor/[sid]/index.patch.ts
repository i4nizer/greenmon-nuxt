import { Sensor } from "~~/server/models"
import { SensorSchema, SensorUpdateSchema } from "~~/shared/schema/sensor"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const bodyResult = await readValidatedBody(event, SensorUpdateSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))

	// --- Use Routed Params
	const { mid, sid } = getRouterParams(event)

	// --- Find and Update Sensor
	const sensor = await Sensor.findOne({ where: { id: sid, mcuId: mid } })
	if (!sensor) return sendError(event, createError({ statusCode: 400, statusMessage: "Sensor not found." }))
	await sensor.update(bodyResult.data)

	// --- Send Sensor
	return SensorSchema.parse(sensor.dataValues)
})
