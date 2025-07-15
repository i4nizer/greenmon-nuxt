import z from "zod";

//

const PinSchema = z.object({
    id: z.number(),
	type: z.enum(["Digital", "Analog"]),
	mode: z.enum(["Unset", "Input", "Output", "Other"]),
	number: z.coerce.number(),
	mcuId: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

const PinCreateSchema = PinSchema.pick({ type: true, mode: true, number: true })
const PinUpdateSchema = PinSchema.pick({ id: true, type: true, mode: true, number: true })

//

type Pin = z.infer<typeof PinSchema>
type PinCreate = z.infer<typeof PinCreateSchema>
type PinUpdate = z.infer<typeof PinUpdateSchema>

//

export {
    PinSchema,
    PinCreateSchema,
    PinUpdateSchema,
}

export type {
    Pin,
    PinCreate,
    PinUpdate,
}