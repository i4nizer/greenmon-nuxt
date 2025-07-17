import { z } from "zod"
import { UserSchema } from "~~/shared/schema/user"

//

const AuthUserSchema = UserSchema.omit({ password: true })
type AuthUser = z.infer<typeof AuthUserSchema>

const authUserBase = {
	id: -1,
	name: "",
	email: "",
	phone: undefined,
	verified: false,
	disabled: false,
	createdAt: new Date(),
	updatedAt: new Date(),
}

//

export const useAuthStore = defineStore("auth", () => {
    // --- Data
    const user = reactive<AuthUser>({ ...authUserBase })

    // --- Getters
    const hydrated = computed(() => user.id != authUserBase.id)

    // --- De/Hydration
    const hydrate = async () => {
        const headers = useRequestHeaders(["cookie"])
        const data = await $fetch("/api/user", { headers })
        Object.assign(user, { ...data })
        user.createdAt = new Date(data.createdAt)
        user.updatedAt = new Date(data.updatedAt)
    }

    const dehydrate = () => Object.assign(user, authUserBase)

    // --- Expose
    return { user, hydrated, hydrate, dehydrate }
})