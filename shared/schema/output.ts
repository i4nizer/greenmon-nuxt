import z from "zod";

//

const OutputSchema = z.object({
    id: z.number(),
    icon: z.string().optional(),
    name: z.string(),
    unit: z.string().optional(),
    pinId: z.number(),
    sensorId: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

const OutputCreateSchema = OutputSchema.pick({ icon: true, name: true, unit: true, pinId: true })
const OutputUpdateSchema = OutputSchema.pick({ id: true, icon: true, name: true, unit: true, pinId: true })

//

type Output = z.infer<typeof OutputSchema>
type OutputCreate = z.infer<typeof OutputCreateSchema>
type OutputUpdate = z.infer<typeof OutputUpdateSchema>

//

export {
    OutputSchema,
    OutputCreateSchema,
    OutputUpdateSchema,
}

export type {
    Output,
    OutputCreate,
    OutputUpdate,
}