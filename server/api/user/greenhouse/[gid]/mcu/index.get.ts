import { Mcu } from "~~/server/models"
import { PaginationSchema } from "~~/shared/schema/pagination"

//

export default defineEventHandler(async (event) => {
	// --- Params
	const { gid } = getRouterParams(event)

	// --- Query for Pagination & Limiting
	const queryResult = await getValidatedQuery(event, PaginationSchema.safeParse)
	if (!queryResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: queryResult.error.message }))
	const { limit, offset } = queryResult.data

	// --- Use them to find Greenhouse
	return await Mcu.findAll({ where: { greenhouseId: gid }, limit, offset })
})
