import { Mcu } from "~/server/models";
import { McuUpdateSchema } from "~/shared/schema/mcu";

//

export default defineEventHandler(async (event) => {
	// --- Params
	const { gid, mid } = getRouterParams(event)

	// --- Validation
	const bodyResult = await readValidatedBody(event, McuUpdateSchema.safeParse)
	if (!bodyResult.success) return sendError(event, createError({ statusCode: 400, statusMessage: bodyResult.error.message }))
	const { name, label } = bodyResult.data

    // --- Find & Update Mcu
    const mcu = await Mcu.findOne({ where: { id: mid, greenhouseId: gid } })
    if (!mcu) return sendError(event, createError({ statusCode: 400, statusMessage: "Mcu not found." }))
    await mcu.update({ name, label })

	// --- Filter & Send Mcu
	return McuUpdateSchema.parse(mcu.dataValues)
})