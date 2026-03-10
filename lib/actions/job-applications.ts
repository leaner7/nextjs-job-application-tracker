"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import { Board, Column, JobApplication } from "@/lib/models"
import { getSession } from "@/lib/auth/auth"

const createJobSchema = z.object({
	company: z.string().min(1, "Company is required").trim(),
	position: z.string().min(1, "Position is required").trim(),
	columnId: z.string().min(1),
	boardId: z.string().min(1),
	location: z.string().trim().optional(),
	salary: z.string().trim().optional(),
	jobUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
	appliedDate: z.string().optional(),
	notes: z.string().trim().optional(),
	description: z.string().trim().optional(),
	tags: z.string().trim().optional(),
})

export type CreateJobInput = z.infer<typeof createJobSchema>

export async function createJobApplication(input: CreateJobInput) {
	const session = await getSession()
	if (!session?.user) {
		return { error: "Unauthorized" }
	}

	const parsed = createJobSchema.safeParse(input)
	if (!parsed.success) {
		return { error: parsed.error.issues[0].message }
	}

	await connectDB()

	// Verify board ownership
	const board = await Board.findOne({
		_id: parsed.data.boardId,
		userId: session.user.id,
	})
	if (!board) {
		return { error: "Board not found" }
	}

	// Verify column belongs to the board
	const column = await Column.findOne({
		_id: parsed.data.columnId,
		boardId: board._id,
	})
	if (!column) {
		return { error: "Column not found" }
	}

	const maxOrder = await JobApplication.findOne({
		columnId: parsed.data.columnId,
	})
		.sort({ order: -1 })
		.select("order")
		.lean()

	// Determine status from column name
	const statusMap: Record<string, string> = {
		wishlist: "wishlist",
		applied: "applied",
		interview: "interview",
		offer: "offer",
		rejected: "rejected",
	}
	const status = statusMap[column.name.toLowerCase()] ?? "applied"

	// Parse tags from comma-separated string
	const tags = parsed.data.tags
		? parsed.data.tags
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: []

	const job = await JobApplication.create({
		company: parsed.data.company,
		position: parsed.data.position,
		location: parsed.data.location || undefined,
		salary: parsed.data.salary || undefined,
		jobUrl: parsed.data.jobUrl || undefined,
		appliedDate: parsed.data.appliedDate
			? new Date(parsed.data.appliedDate)
			: undefined,
		notes: parsed.data.notes || undefined,
		description: parsed.data.description || undefined,
		tags,
		status,
		columnId: column._id,
		boardId: board._id,
		userId: session.user.id,
		order: maxOrder ? maxOrder.order + 1 : 0,
	})

	// Push job ID into column's jobApplications array
	await Column.findByIdAndUpdate(column._id, {
		$push: { jobApplications: job._id },
	})

	revalidatePath("/dashboard")

	return { success: true, data: JSON.parse(JSON.stringify(job)) }
}
