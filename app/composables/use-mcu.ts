import type { Mcu, McuCreate, McuUpdate } from "~~/shared/schema/mcu"

//

export const useMcu = (key: string = "mcus") => {
    // --- States
    const mcus = useState<Mcu[]>(key, () => [])
    const hydrated = useState<boolean>(`${key}-hydrated`, () => false)
    
    // --- Actions
    /** 
     * @param gid McuID
     * @param force Override hydrated state. 
     */
    const hydrateMcu = async (gid?: number, force: boolean = false): Promise<SafeResult<Mcu[]>> => {
        try {
            if (hydrated.value && !force) return { data: mcus.value, error: undefined }
            const url = `/api/user/greenhouse` + (gid ? `/${gid}` : '') + '/mcu'
            const headers = useRequestHeaders(["cookie"])
            const res = await $fetch<Mcu[]>(url, { headers })
            
            mcus.value.splice(0, mcus.value.length)
            mcus.value.push(...res)

            hydrated.value = true
            return { data: res, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }

    /**
     * @param gid GreenhouseID
     */
    const createMcu = async (gid: number, mcu: McuCreate): Promise<SafeResult<Mcu>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu`
            const res = await $fetch<Mcu>(url, { method: "POST", body: mcu })
            
            mcus.value.push(res)
            return { data: res, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    /** 
     * @param gid GreenhouseID 
     * @param mid McuID 
     */
    const retrieveMcu = async (gid: number, mid: number): Promise<SafeResult<Mcu>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}`
            const headers = useRequestHeaders(["cookie"])
            const mcu = await $fetch<Mcu>(url, { headers })
            
            const olds = mcus.value.filter(m => m.id == mid)
            olds.forEach(s => Object.assign(s, mcu))
            if (olds.length <= 0) mcus.value.push(mcu)

            return { data: mcu, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }

    /**
     * @param gid GreenhouseID
     */
    const updateMcu = async (gid: number, mcu: McuUpdate): Promise<SafeResult<Mcu>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mcu.id}`
            const res = await $fetch<Mcu>(url, { method: "PATCH", body: mcu })

            const olds = mcus.value.filter((m) => m.id == mcu.id)
            olds.forEach((o) => Object.assign(o, res))
            if (olds.length <= 0) mcus.value.push(res)
            
            return { data: res, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    /** 
     * @param gid GreenhouseID 
     * @param mid McuID 
     */
    const deleteMcu = async (gid: number, mid: number): Promise<SafeResult<undefined>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}`
            await $fetch(url, { method: "DELETE" })
                
            const data = mcus.value.filter((m) => m.id != mid)
            mcus.value.splice(0, mcus.value.length)
            mcus.value.push(...data)

            return { data: undefined, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    // --- Expose
    return {
        mcus,
        hydrateMcu,
        createMcu, 
        retrieveMcu,
        updateMcu,
        deleteMcu,
    }
}