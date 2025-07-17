
//

interface ISnackbarQueueItem {
    text: string
    color?: string
    timeout?: number
}

//

export const useSnackbarStore = defineStore("snackbar", () => {
    // --- Data
    const queue = reactive<ISnackbarQueueItem[]>([])

    // --- Actions
    const append = (snack: ISnackbarQueueItem) => queue.push(snack)

    // --- Expose
    return { queue, append }
})