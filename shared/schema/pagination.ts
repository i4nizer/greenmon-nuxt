import z from "zod";

//

const PaginationSchema = z.object({
    limit: z.coerce.number().optional(),
    offset: z.coerce.number().optional(),
})

//

type Pagination = z.infer<typeof PaginationSchema>

//

export { PaginationSchema, type Pagination }