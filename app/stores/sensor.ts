import type { Sensor, SensorCreate, SensorUpdate } from "~~/shared/schema/sensor"

//

export const useSensorStore = defineStore("sensors", () => {
    // --- States
    const sensors = reactive<Sensor[]>([])
    const hydrated = ref<boolean>(false)
    
    // --- Actions
    /** 
     * @param gid GreenhouseID 
     * @param mid McuID 
     * @param force Override hydrated state. 
     */
    const hydrateSensor = async (gid: number, mid?: number, force: boolean = false): Promise<SafeResult<Sensor[]>> => {
        try {
            if (hydrated.value && !force) return { data: sensors, error: undefined }
            const url = `/api/user/greenhouse/${gid}/mcu` + (mid ? `/${mid}` : '') + '/sensor'
            const requestFetch = useRequestFetch()
            const res = await requestFetch<Sensor[]>(url)
            
            sensors.splice(0, sensors.length)
            sensors.push(...res)

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
    const createSensor = async (gid: number, mid: number, sensor: SensorCreate): Promise<SafeResult<Sensor>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor`
            const res = await $fetch<Sensor>(url, { method: "POST", body: sensor })
			
            sensors.push(res)
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
    const retrieveSensor = async (gid: number, mid: number, sid: number): Promise<SafeResult<Sensor>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sid}`
            const requestFetch = useRequestFetch()
            const sensor = await requestFetch<Sensor>(url)
            
            const olds = sensors.filter(s => s.id == sid)
            olds.forEach(s => Object.assign(s, sensor))
            if (olds.length <= 0) sensors.push(sensor)

            return { data: sensor, error: undefined }
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
    const updateSensor = async (gid: number, mid: number, sensor: SensorUpdate): Promise<SafeResult<Sensor>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sensor.id}`
            const res = await $fetch<Sensor>(url, { method: "PATCH", body: sensor })

            const olds = sensors.filter((s) => s.id == sensor.id)
            olds.forEach((o) => Object.assign(o, res))
            if (olds.length <= 0) sensors.push(res)
            
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
    const deleteSensor = async (gid: number, mid: number, sid: number): Promise<SafeResult<undefined>> => {
        try {
            const url = `/api/user/greenhouse/${gid}/mcu/${mid}/sensor/${sid}`
            await $fetch(url, { method: "DELETE" })
				
            const data = sensors.filter((s) => s.id != sid)
            sensors.splice(0, sensors.length)
            sensors.push(...data)

            return { data: undefined, error: undefined }
        }
        catch (err) {
            const error = (err as typeof err & { statusMessage?: string })
            return { data: undefined, error: error?.statusMessage ?? "Something went wrong." }
        }
    }
    
    // --- Expose
    return {
        sensors,
        hydrateSensor,
        createSensor, 
        retrieveSensor,
        updateSensor,
        deleteSensor,
    }
})