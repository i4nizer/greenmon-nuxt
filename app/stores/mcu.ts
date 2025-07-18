import type { Mcu, McuCreate, McuUpdate } from "~~/shared/schema/mcu"

//

export const useMcuStore = defineStore("mcus", () => {
    // --- States
    const mcus = reactive<Mcu[]>([])
    const hydrated = ref<boolean>(false)
    
    // --- Actions
    /** 
     * @param gid McuID
     * @param force Override hydrated state. 
     */
    const hydrateMcu = async (gid?: number, force: boolean = false): Promise<SafeResult<Mcu[]>> => {
        try {
            if (hydrated.value && !force) return { success: true, data: mcus, error: undefined }
            const url = `/api/user/greenhouse` + (gid ? `/${gid}` : '') + '/mcu'
            const requestFetch = useRequestFetch()
            const res = await requestFetch<Mcu[]>(url)
            
            mcus.splice(0, mcus.length)
            mcus.push(...res)

            hydrated.value = true
            return { success: true, data: res, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { success: false, data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }

    /**
     * @param gid GreenhouseID
     */
    const createMcu = async (gid: number, mcu: McuCreate): Promise<SafeResult<Mcu>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu`
            const res = await $fetch<Mcu>(url, { method: "POST", body: mcu })
            
            mcus.push(res)
            return { success: true, data: res, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { success: false, data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    /** 
     * @param gid GreenhouseID 
     * @param mid McuID 
     */
    const retrieveMcu = async (gid: number, mid: number): Promise<SafeResult<Mcu>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}`
            const requestFetch = useRequestFetch()
            const mcu = await requestFetch<Mcu>(url)
            
            const olds = mcus.filter(m => m.id == mid)
            olds.forEach(s => Object.assign(s, mcu))
            if (olds.length <= 0) mcus.push(mcu)

            return { success: true, data: mcu, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { success: false, data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }

    /**
     * @param gid GreenhouseID
     */
    const updateMcu = async (gid: number, mcu: McuUpdate): Promise<SafeResult<Mcu>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mcu.id}`
            const res = await $fetch<Mcu>(url, { method: "PATCH", body: mcu })

            const olds = mcus.filter((m) => m.id == mcu.id)
            olds.forEach((o) => Object.assign(o, res))
            if (olds.length <= 0) mcus.push(res)
            
            return { success: true, data: res, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { success: false, data: undefined, error: error?.statusMessage ?? "Something went wrong." }
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
                
            const data = mcus.filter((m) => m.id != mid)
            mcus.splice(0, mcus.length)
            mcus.push(...data)

            return { success: true, data: undefined, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { success: false, data: undefined, error: error?.statusMessage ?? "Something went wrong." }
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
})