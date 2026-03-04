import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const client = new MongoClient(process.env.MONGODB_URI!)

export const auth = betterAuth({
	database: mongodbAdapter(client.db(), { client }),
	emailAndPassword: {
		enabled: true,
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
