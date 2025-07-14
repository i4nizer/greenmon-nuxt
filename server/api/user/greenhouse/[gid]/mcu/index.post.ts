import z from "zod"
import { Mcu, Token } from "~/server/models"
import { McuCreateSchema, McuSchema } from "~/shared/schema/mcu"

//

export default defineEventHandler(async (event) => {
    // --- Safely Transform Params
    const paramsSchema = z.object({ gid: z.coerce.number() })
    const paramsResult = await getValidatedRouterParams(event, paramsSchema.safeParse)
    if (!paramsResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: paramsResult.error.message }))
    const { gid } = paramsResult.data

	// --- Get User
    const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }
    
	// --- Validation
	const bodyResult = await readValidatedBody(event, McuCreateSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const { name, label } = bodyResult.data

	// --- Create & Ref Dummy Token
	const token = await Token.create({ value: "", type: "Mcu", userId: payload.id })
    const mcu = await Mcu.create({ name, label, connected: false, tokenId: token.id, greenhouseId: gid })
    
    // --- Update Token Value
    const mcuToken = createToken({ id: mcu.id }, "Mcu")
    await token.update({ value: mcuToken })

    // --- Filter & Send Mcu
    return McuSchema.parse(mcu.dataValues)
})