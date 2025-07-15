import { Op } from "sequelize"
import z from "zod"
import { Pin } from "~/server/models"
import { PinCreateSchema, PinSchema } from "~/shared/schema/pin"

//

export default defineEventHandler(async (event) => {
    // --- Requires array of Pins
    const validationSchema = z.array(PinCreateSchema)
    const bodyResult = await readValidatedBody(event, validationSchema.safeParse)
    if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
    
    // --- Use Params for Id
    const params = getRouterParams(event)
    const paramSchema = z.object({ gid: z.coerce.number(), mid: z.coerce.number() })
    const paramsResult = paramSchema.safeParse(params)
    if (!paramsResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: paramsResult.error.message }))
    const { mid } = paramsResult.data
    
    // --- Check [mcuId, type, number] constraint
    const pinNumbers = bodyResult.data.map(p => p.number)
    const takenPin = await Pin.findOne({ where: { number: { [Op.in]: pinNumbers }, mcuId: mid }, attributes: ['number'] })
    if (takenPin) return sendError(event, createError({ statusCode: 400, statusMessage: `Pin number ${takenPin.number} is taken.` }))

    // --- Create Pins
    const data = bodyResult.data.map(p => ({ ...p, mcuId: mid }))
    const pins = await Pin.bulkCreate(data, { individualHooks: true })
    
    // --- Send Pins
    const pinsSchema = z.array(PinSchema)
    return pinsSchema.parse(pins)
})