import { Output } from "~/server/models"

//

export default defineEventHandler(async (event) => {
    // --- Use Routed Params
    const { sid, oid } = getRouterParams(event)

    // --- Delete & Send Result
    const rows = await Output.destroy({ where: { id: oid, sensorId: sid } })
    if (rows <= 0) return sendError(event, createError({ statusCode: 400, statusMessage: "Output not found." }))
    return { success: rows > 0 }
})