import { Greenhouse } from "~/server/models"

//

export default defineEventHandler(async (event) => {
    // --- Get User
    const payload = event.context.accessTokenPayload as { id: number; name: string; email: string }

    // --- Use Params for the id
    const id = getRouterParam(event, "id")
    if (!id) return sendError(event, createError({ statusCode: 400, statusMessage: "User id required." }))
    const rows = await Greenhouse.destroy({ where: { id, userId: payload.id } })

    // --- Send Result
    if (rows <= 0) return sendError(event, createError({ statusCode: 400, statusMessage: "Greenhouse not found." }))
    return { success: true }
})
