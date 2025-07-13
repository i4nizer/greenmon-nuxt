import { Greenhouse, Token } from "~/server/models"
import { GreenhouseSchema } from "~/shared/schema/greenhouse"

//

const GreenhouseCreationSchema = GreenhouseSchema.pick({
	name: true,
	description: true,
})

//

export default defineEventHandler(async (event) => {
	// --- Get User
	const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

	// --- Validation
	const bodyResult = await readValidatedBody(event, GreenhouseCreationSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const body = bodyResult.data

	// --- Create & Ref Dummy Token
	const token = await Token.create({ type: "Greenhouse", value: "dummy", userId: payload.id })
	const greenhouse = await Greenhouse.create({ ...body, userId: payload.id, tokenId: token.id })

	// --- Update Token Value
	const ghToken = createToken({ id: greenhouse.id }, "Greenhouse")
	await token.update({ value: ghToken })

	// --- Send Greenhouse
	return GreenhouseSchema.parse(greenhouse.dataValues)
})
