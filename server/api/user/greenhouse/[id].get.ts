import { Greenhouse } from "~/server/models"

//

export default defineEventHandler(async (event) => {
	// --- Get User
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Use Params for the id
	const id = getRouterParam(event, "id")
	if (!id) return sendError(event, createError({ statusCode: 400, statusMessage: "User id required." }))
	const greenhouse = await Greenhouse.findOne({ where: { id, userId: payload.id } })

	// --- Send Result
	if (!greenhouse) return sendError(event, createError({ statusCode: 400, statusMessage: "Greenhouse not found." }))
	return greenhouse
})
