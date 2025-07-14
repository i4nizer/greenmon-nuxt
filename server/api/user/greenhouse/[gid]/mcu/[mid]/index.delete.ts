import { Mcu } from "~/server/models"

//

export default defineEventHandler(async (event) => {
    // --- Use Params for the id
    const { gid, mid } = getRouterParams(event)
    if (!mid) return sendError(event, createError({ statusCode: 400, statusMessage: "Mcu id required." }))
    const rows = await Mcu.destroy({ where: { id: mid, greenhouseId: gid } })

    // --- Send Result
    if (rows <= 0) return sendError(event, createError({ statusCode: 400, statusMessage: "Mcu not found." }))
    return { success: true }
})
