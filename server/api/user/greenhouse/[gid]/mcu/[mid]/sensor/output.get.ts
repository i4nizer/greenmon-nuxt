import { Output, Sensor } from "~~/server/models"
import { PaginationSchema } from "~~/shared/schema/pagination"

//

export default defineEventHandler(async (event) => {
	// --- Params
	const { mid } = getRouterParams(event)

	// --- Pagination
	const queryResult = await getValidatedQuery(event, PaginationSchema.safeParse)
	if (!queryResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: queryResult.error.message }))
	const { limit, offset } = queryResult.data

	// --- Get & Send All Outputs under mcuId
	return await Output.findAll({
		include: {
			model: Sensor,
			where: { mcuId: mid },
			required: true,
			attributes: [],
		},
		limit,
		offset,
	})
})
