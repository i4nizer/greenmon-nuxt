import { Greenhouse } from "~/server/models"
import { GreenhouseSchema, GreenhouseUpdateSchema } from "~/shared/schema/greenhouse"

//

export default defineEventHandler(async (event) => {
	// --- Get User
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Validation
	const validationSchema = GreenhouseUpdateSchema.omit({ id: true })
	const bodyResult = await readValidatedBody(event, validationSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const body = bodyResult.data
	
	// --- Use param
	const { gid } = getRouterParams(event)

	// --- Find & Update
	const greenhouse = await Greenhouse.findOne({ where: { id: gid, userId: payload.id } })
	if (!greenhouse) return sendError(event, createError({ statusCode: 400, statusMessage: "Greenhouse not found." }))
	await greenhouse.update(body)

	// --- Send Updated
	return GreenhouseSchema.parse(greenhouse.dataValues)
})
