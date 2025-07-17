import { Output } from "~~/server/models"
import { OutputSchema, OutputUpdateSchema } from "~~/shared/schema/output"

//

export default defineEventHandler(async (event) => {
	// --- Validation
	const bodyResult = await readValidatedBody(event, OutputUpdateSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))

	// --- Params for Ids
	const { sid, oid } = getRouterParams(event)

	// --- Find and Update Output
	const output = await Output.findOne({ where: { id: oid, sensorId: sid } })
	if (!output) return sendError(event, createError({ statusCode: 400, statusMessage: "Output not found." }))
	await output.update(bodyResult.data)

	// --- Send Output
	return OutputSchema.parse(output.dataValues)
})
