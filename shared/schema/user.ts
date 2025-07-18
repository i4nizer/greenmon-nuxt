import { z } from "zod"

//

const UserSchema = z.object({
	id: z.number().int(),
	name: z.string().min(1).max(128),
	email: z.string().email(),
	phone: z.string().regex(/^\d+$/, "Must be numerical.").optional(),
	password: z.string().min(8).max(128),
	verified: z.boolean(),
	disabled: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

const UserSafeSchema = UserSchema.omit({ password: true })
const UserSignUpSchema = UserSchema.pick({ name: true, email: true, password: true })
const UserSignInSchema = UserSchema.pick({ email: true, password: true })
const UserEmailSchema = UserSchema.pick({ email: true })
const UserPasswordResetSchema = UserSchema
	.pick({ password: true })
	.extend({ confirm: z.string().min(8).max(128), token: z.string().jwt() })
	.refine((data) => data.confirm === data.password, { message: "Passwords must match.", path: ["confirm"] })
const UserAccountSchema = UserSchema.pick({ name: true, email: true, phone: true })

//

type User = z.infer<typeof UserSchema>
type UserSafe = z.infer<typeof UserSafeSchema>
type UserSignUp = z.infer<typeof UserSignUpSchema>
type UserSignIn = z.infer<typeof UserSignInSchema>
type UserEmail = z.infer<typeof UserEmailSchema>
type UserPasswordReset = z.infer<typeof UserPasswordResetSchema>
type UserAccount = z.infer<typeof UserAccountSchema>

//

export {
	UserSchema,
	UserSafeSchema,
	UserSignUpSchema,
	UserSignInSchema,
	UserEmailSchema,
	UserPasswordResetSchema,
	UserAccountSchema,
}

export type {
	User,
	UserSafe,
	UserSignUp,
	UserSignIn,
	UserEmail,
	UserPasswordReset,
	UserAccount,
}