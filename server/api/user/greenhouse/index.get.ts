import z from "zod"
import { Greenhouse } from "~/server/models"

//

const PaginationSchema = z.object({
	limit: z.coerce.number().optional(),
	offset: z.coerce.number().optional(),
})

//

export default defineEventHandler(async (event) => {
	// --- Get User
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Query for Pagination & Limiting
	const { limit, offset } = await getValidatedQuery(event, PaginationSchema.parse)

	// --- Use them to find Greenhouse
	return await Greenhouse.findAll({ where: { userId: payload.id }, limit, offset })
})
