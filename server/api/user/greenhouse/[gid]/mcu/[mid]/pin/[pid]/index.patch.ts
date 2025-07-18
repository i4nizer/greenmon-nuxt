import { Op } from "sequelize"
import { Pin } from "~~/server/models"
import { PinSchema, PinUpdateSchema } from "~~/shared/schema/pin"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const bodyResult = await readValidatedBody(event, PinUpdateSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const body = bodyResult.data
	
	// --- Params for Ids
	const { mid, pid } = getRouterParams(event)

	// --- Check Pin Number
	const numberPin = await Pin.findOne({ where: { id: { [Op.ne]: pid }, number: body.number, mcuId: mid } })
	if (numberPin) return sendError(event, createError({ statusCode: 400, statusMessage: `Pin number ${body.number} taken.` }))

	// --- Find and Update Pin
	const pin = await Pin.findOne({ where: { id: pid, mcuId: mid } })
	if (!pin) return sendError(event, createError({ statusCode: 400, statusMessage: "Pin not found." }))
	await pin.update(body)

	// --- Send Pin
	return PinSchema.parse(pin.dataValues)
})
