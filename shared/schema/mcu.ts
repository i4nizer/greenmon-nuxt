import z from "zod";

//

const McuSchema = z.object({
	id: z.number(),
	name: z.string().min(1),
	label: z.string().optional(),
	connected: z.boolean(),
	tokenId: z.number(),
	greenhouseId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

const McuCreateSchema = McuSchema.pick({ name: true, label: true })
const McuUpdateSchema = McuSchema.pick({ id: true, name: true, label: true })

//

type Mcu = z.infer<typeof McuSchema>
type McuCreate = z.infer<typeof McuCreateSchema>
type McuUpdate = z.infer<typeof McuUpdateSchema>

//

export {
    McuSchema,
    McuCreateSchema,
    McuUpdateSchema
}

export type {
    Mcu,
    McuCreate,
    McuUpdate,
}