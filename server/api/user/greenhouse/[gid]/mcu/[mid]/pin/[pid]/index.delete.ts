import { Pin } from "~/server/models"

//

export default defineEventHandler(async (event) => {
    // --- Use Routed Params
    const { mid, pid } = getRouterParams(event)

    // --- Delete & Send Result
    const rows = await Pin.destroy({ where: { id: pid, mcuId: mid } })
    if (rows <= 0) return sendError(event, createError({ statusCode: 400, statusMessage: "Pin not found." }))
    return { success: rows > 0 }
})