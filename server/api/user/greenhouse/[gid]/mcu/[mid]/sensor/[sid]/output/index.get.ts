import { Output } from "~/server/models"
import { PaginationSchema } from "~/shared/schema/pagination"

//

export default defineEventHandler(async (event) => {
	// --- Params
	const { sid } = getRouterParams(event)

	// --- Query for Pagination & Limiting
	const queryResult = await getValidatedQuery(event, PaginationSchema.safeParse)
	if (!queryResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: queryResult.error.message }))
	const { limit, offset } = queryResult.data

	// --- Find & Send
	return await Output.findAll({ where: { sensorId: sid }, limit, offset })
})