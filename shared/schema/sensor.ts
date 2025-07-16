import z from "zod";

//

const SensorSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
    label: z.string().optional(),
    interval: z.number(),
    lastread: z.number(),
    readphase: z.enum(["Off", "Before", "During", "After"]),
    disabled: z.boolean(),
    mcuId: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

const SensorCreateSchema = SensorSchema.pick({ name: true, label: true, interval: true })
const SensorUpdateSchema = SensorSchema.pick({ id: true, name: true, label: true, interval: true, disabled: true })

//

type Sensor = z.infer<typeof SensorSchema>
type SensorCreate = z.infer<typeof SensorCreateSchema>
type SensorUpdate = z.infer<typeof SensorUpdateSchema>

//

export {
    SensorSchema,
    SensorCreateSchema,
    SensorUpdateSchema,
}

export type {
    Sensor,
    SensorCreate,
    SensorUpdate,
}