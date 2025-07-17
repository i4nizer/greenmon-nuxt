import { Sensor } from "~~/server/models"

//

export default defineEventHandler(async (event) => {
	// --- Use Routed Params
	const { mid, sid } = getRouterParams(event)

	// --- Delete
	const rows = await Sensor.destroy({ where: { id: sid, mcuId: mid } })

	// --- Send Result
	if (rows <= 0) return sendError(event, createError({ statusCode: 400, statusMessage: "Sensor not found." }))
	return { success: true }
})
