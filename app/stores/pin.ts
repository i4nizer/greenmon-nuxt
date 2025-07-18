import type { Pin, PinCreate, PinUpdate } from "~~/shared/schema/pin"

//

export const usePinStore = defineStore("pins", () => {
    // --- States
    const pins = reactive<Pin[]>([])
    const hydrated = ref<boolean>(false)
    
    // --- Actions
    /** 
     * @param gid GreenhouseID
     * @param mid McuID
     * @param force Override hydrated state. 
     */
    const hydratePin = async (gid: number, mid?: number, force: boolean = false): Promise<SafeResult<Pin[]>> => {
        try {
            if (hydrated.value && !force) return { data: pins, error: undefined }
            const url = `/api/user/greenhouse/${gid}/mcu` + (mid ? `/${mid}` : '') + '/pin'
            const requestFetch = useRequestFetch()
            const res = await requestFetch<Pin[]>(url)
            
            pins.splice(0, pins.length)
            pins.push(...res)

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
     */
    const createPin = async (gid: number, mid: number, pin: PinCreate): Promise<SafeResult<Pin>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/pin`
            const res = await $fetch<Pin>(url, { method: "POST", body: [pin] })
            
            pins.push(res)
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
     * @param pid PinID 
     */
    const retrievePin = async (gid: number, mid: number, pid: number): Promise<SafeResult<Pin>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/pin/${pid}`
            const requestFetch = useRequestFetch()
            const pin = await requestFetch<Pin>(url)
            
            const olds = pins.filter(p => p.id == pid)
            olds.forEach(s => Object.assign(s, pin))
            if (olds.length <= 0) pins.push(pin)

            return { data: pin, error: undefined }
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
    const updatePin = async (gid: number, mid: number, pin: PinUpdate): Promise<SafeResult<Pin>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/pin/${pin.id}`
            const res = await $fetch<Pin>(url, { method: "PATCH", body: pin })

            const olds = pins.filter((p) => p.id == pin.id)
            olds.forEach((o) => Object.assign(o, res))
            if (olds.length <= 0) pins.push(res)
            
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
     * @param pid PinID 
     */
    const deletePin = async (gid: number, mid: number, pid: number): Promise<SafeResult<undefined>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/pin/${pid}`
            await $fetch(url, { method: "DELETE" })
            
            const data = pins.filter((p) => p.id != pid)
            pins.splice(0, pins.length)
            pins.push(...data)

            return { data: undefined, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    // --- Expose
    return {
        pins,
        hydratePin,
        createPin, 
        retrievePin,
        updatePin,
        deletePin,
    }
})