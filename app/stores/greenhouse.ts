import type { Greenhouse, GreenhouseCreate, GreenhouseUpdate } from "~~/shared/schema/greenhouse"

//

export const useGreenhouseStore = defineStore("greenhouses", () => {
    // --- States
    const greenhouses = reactive<Greenhouse[]>([])
    const hydrated = ref<boolean>(false)
    
    // --- Actions
    /** 
     * @param force Override hydrated state. 
     */
    const hydrateGreenhouse = async (force: boolean = false): Promise<SafeResult<Greenhouse[]>> => {
        try {
            if (hydrated.value && !force) return { success: true, data: greenhouses, error: undefined }
            const url = `/api/user/greenhouse`
            const requestFetch = useRequestFetch()
            const res = await requestFetch<Greenhouse[]>(url)
            
            greenhouses.splice(0, greenhouses.length)
            greenhouses.push(...res)

            hydrated.value = true
            return { success: true, data: res, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { success: false, data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }

    const createGreenhouse = async (greenhouse: GreenhouseCreate): Promise<SafeResult<Greenhouse>> => {
        try {
            const url = `/api/user/greenhouse`
            const res = await $fetch<Greenhouse>(url, { method: "POST", body: greenhouse })
            
            greenhouses.push(res)
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
    const retrieveGreenhouse = async (gid: number): Promise<SafeResult<Greenhouse>> => {
        try {
            const url = `/api/user/greenhouse/${gid}`
            const requestFetch = useRequestFetch()
            const greenhouse = await requestFetch<Greenhouse>(url)
            
            const olds = greenhouses.filter(g => g.id == gid)
            olds.forEach(s => Object.assign(s, greenhouse))
            if (olds.length <= 0) greenhouses.push(greenhouse)

            return { success: true, data: greenhouse, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { success: false, data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    const updateGreenhouse = async (greenhouse: GreenhouseUpdate): Promise<SafeResult<Greenhouse>> => {
        try {
            const url = `/api/user/greenhouse/${greenhouse.id}`
            const res = await $fetch<Greenhouse>(url, { method: "PATCH", body: greenhouse })

            const olds = greenhouses.filter((g) => g.id == greenhouse.id)
            olds.forEach((o) => Object.assign(o, res))
            if (olds.length <= 0) greenhouses.push(res)
            
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
    const deleteGreenhouse = async (gid: number): Promise<SafeResult<undefined>> => {
        try {
            const url = `/api/user/greenhouse/${gid}`
            await $fetch(url, { method: "DELETE" })
                
            const data = greenhouses.filter((g) => g.id != gid)
            greenhouses.splice(0, greenhouses.length)
            greenhouses.push(...data)

            return { success: true, data: undefined, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { success: false, data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    // --- Expose
    return {
        greenhouses,
        hydrateGreenhouse,
        createGreenhouse, 
        retrieveGreenhouse,
        updateGreenhouse,
        deleteGreenhouse,
    }
})