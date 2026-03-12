import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { initUserBoard } from "@/lib/init-user-board"
import connectDB from "../db"

const mongoostInstance = await connectDB()
const client = mongoostInstance.connection.getClient()

export const auth = betterAuth({
	database: mongodbAdapter(client.db(), { client }),
	emailAndPassword: {
		enabled: true,
	},
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					if (user.id) {
						await initUserBoard(user.id)
					}
				},
			},
		},
	},
})

export async function getSession() {
	const result = await auth.api.getSession({
		headers: await headers(),
	})

	return result
}

export async function logOut() {
	const result = await auth.api.signOut({
		headers: await headers(),
	})

	if (result.success) {
		redirect("/sign-in")
	}
}
