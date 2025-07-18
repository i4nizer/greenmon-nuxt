import type { Output, OutputCreate, OutputUpdate } from "~~/shared/schema/output"

//

export const useOutputStore = defineStore("outputs", () => {
    // --- States
    const outputs = reactive<Output[]>([])
    const hydrated = ref<boolean>(false)
    
    // --- Actions
    /** 
     * @param gid GreenhouseID 
     * @param mid McuID 
     * @param sid SensorID 
     * @param force Override hydrated state. 
     */
    const hydrateOutput = async (gid: number, mid: number, sid?: number, force: boolean = false): Promise<SafeResult<Output[]>> => {
        try {
            if (hydrated.value && !force) return { data: outputs, error: undefined }
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor` + (sid ? `/${sid}` : '') + "/output"
            const requestFetch = useRequestFetch()
            const res = await requestFetch<Output[]>(url)
            
            outputs.splice(0, outputs.length)
            outputs.push(...res)

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
     * @param mid McuID 
     * @param sid SensorID 
     */
    const createOutput = async (gid: number, mid: number, sid: number, output: OutputCreate): Promise<SafeResult<Output>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sid}/output`
            const res = await $fetch<Output>(url, { method: "POST", body: output })
            
            outputs.push(res)
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
     * @param sid SensorID 
     * @param oid OutputID 
     */
    const retrieveOutput = async (gid: number, mid: number, sid: number, oid: number): Promise<SafeResult<Output>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sid}/output/${oid}`
            const requestFetch = useRequestFetch()
            const output = await requestFetch<Output>(url)
            
            const olds = outputs.filter(o => o.id == oid)
            olds.forEach(s => Object.assign(s, output))
            if (olds.length <= 0) outputs.push(output)

            return { data: output, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    /** 
     * @param gid GreenhouseID 
     * @param mid McuID 
     * @param sid SensorID 
     */
    const updateOutput = async (gid: number, mid: number, sid: number, output: OutputUpdate): Promise<SafeResult<Output>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sid}/output/${output.id}`
            const res = await $fetch<Output>(url, { method: "PATCH", body: output })

            const olds = outputs.filter((o) => o.id == output.id)
            olds.forEach((o) => Object.assign(o, res))
            if (olds.length <= 0) outputs.push(res)
            
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
     * @param sid SensorID 
     * @param oid OutputID 
     */
    const deleteOutput = async (gid: number, mid: number, sid: number, oid: number): Promise<SafeResult<undefined>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sid}/output/${oid}`
            await $fetch(url, { method: "DELETE" })
                
            const data = outputs.filter((o) => o.id != oid)
            outputs.splice(0, outputs.length)
            outputs.push(...data)

            return { data: undefined, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    // --- Expose
    return {
        outputs,
        hydrateOutput,
        createOutput, 
        retrieveOutput,
        updateOutput,
        deleteOutput,
    }
})