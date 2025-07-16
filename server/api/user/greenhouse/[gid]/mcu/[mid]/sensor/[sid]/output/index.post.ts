import z from "zod"
import { Output } from "~/server/models"
import { OutputCreateSchema, OutputSchema } from "~/shared/schema/output"

//

export default defineEventHandler(async (event) => {
    // --- Validation
    const bodyResult = await readValidatedBody(event, OutputCreateSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    const body = bodyResult.data
    
    // --- Params
    const params = getRouterParams(event)
    const paramsSchema = z.object({ sid: z.coerce.number() })
    const paramsResult = paramsSchema.safeParse(params)
    if (!paramsResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: paramsResult.error.message }))
    const { sid } = paramsResult.data
    
    // --- Create & Send Output
    const output = await Output.create({ ...body, sensorId: sid })
    return OutputSchema.parse(output)
})