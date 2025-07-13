import { Greenhouse } from "~/server/models"
import { GreenhouseSchema } from "~/shared/schema/greenhouse"

//

const GreenhouseUpdateSchema = GreenhouseSchema.pick({
	id: true,
	name: true,
	description: true,
})

//

export default defineEventHandler(async (event) => {
	// --- Get User
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Validation
	const bodyResult = await readValidatedBody(event, GreenhouseUpdateSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const body = bodyResult.data

	// --- Find & Update
	const greenhouse = await Greenhouse.findOne({ where: { id: body.id, userId: payload.id } })
	if (!greenhouse) return sendError(event, createError({ statusCode: 400, statusMessage: "Greenhouse not found." }))
	await greenhouse.update(body)

	// --- Send Updated
	return GreenhouseSchema.parse(greenhouse)
})
