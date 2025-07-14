import { Mcu } from "~/server/models"

//

export default defineEventHandler(async (event) => {
    // --- Use Params for the id
    const { gid, mid } = getRouterParams(event)
    if (!mid) return sendError(event, createError({ statusCode: 400, statusMessage: "Mcu id required." }))
    const mcu = await Mcu.findOne({ where: { id: mid, greenhouseId: gid } })

    // --- Send Result
    if (!mcu) return sendError(event, createError({ statusCode: 400, statusMessage: "Mcu not found." }))
    return mcu
})
