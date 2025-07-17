import z from "zod"
import { Sensor } from "~~/server/models"
import { SensorSchema, SensorCreateSchema } from "~~/shared/schema/sensor"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const bodyResult = await readValidatedBody(event, SensorCreateSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const body = bodyResult.data

	// --- Use Routed Params
	const params = getRouterParams(event)
	const paramsSchema = z.object({ gid: z.coerce.number(), mid: z.coerce.number() })
	const paramsResult = paramsSchema.safeParse(params)
	if (!paramsResult.success)
		return sendError(event, createError({ statusCode: 400, statusMessage: paramsResult.error.message }))
	const { mid } = paramsResult.data

	// --- Create & Send Sensor
	const sensor = await Sensor.create({ ...body, mcuId: mid })
	return SensorSchema.parse(sensor.dataValues)
})
