import { Greenhouse } from "~~/server/models"

//

export default defineEventHandler(async (event) => {
	// --- Get User
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Use Params for the id
	const { gid } = getRouterParams(event)
	if (!gid) return sendError(event, createError({ statusCode: 400, statusMessage: "Greenhouse id required." }))
	const greenhouse = await Greenhouse.findOne({ where: { id: gid, userId: payload.id } })

	// --- Send Result
	if (!greenhouse) return sendError(event, createError({ statusCode: 400, statusMessage: "Greenhouse not found." }))
	return greenhouse
})
