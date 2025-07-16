import { Sensor } from "~/server/models"
import { PaginationSchema } from "~/shared/schema/pagination"

//

export default defineEventHandler(async (event) => {
    // --- Use Routed Params
    const { gid, mid } = getRouterParams(event)

    // --- Query for Pagination & Limiting
    const queryResult = await getValidatedQuery(event, PaginationSchema.safeParse)
    if (!queryResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: queryResult.error.message }))
    const { limit, offset } = queryResult.data
    
    // --- Get & Send Sensors
    return await Sensor.findAll({ where: { mcuId: mid }, limit, offset })
})