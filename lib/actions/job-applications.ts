"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import connectDB from "@/lib/db"
import { Board, Column, JobApplication } from "@/lib/models"
import { getSession } from "@/lib/auth/auth"
import { createJobFormSchema } from "@/lib/validations"

const createJobSchema = createJobFormSchema.extend({
	columnId: z.string().min(1),
	boardId: z.string().min(1),
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

type UpdateJobInput = Partial<{
	company: string
	position: string
	location: string
	salary: string
	jobUrl: string
	appliedDate: string
	notes: string
	description: string
	tags: string[]
	columnId: string
	order: number
}>

export async function updateJobApplication(
	id: string,
	updates: UpdateJobInput,
) {
	const session = await getSession()
	if (!session?.user) {
		return { error: "Unauthorized" }
	}

	await connectDB()

	const jobApplication = await JobApplication.findById(id)

	if (!jobApplication) {
		return { error: "Job application not found" }
	}

	if (jobApplication.userId !== session.user.id) {
		return { error: "Unauthorized" }
	}

	const { columnId, order, ...otherUpdates } = updates

	const updatesToApply: UpdateJobInput = otherUpdates

	const currentColumnId = jobApplication.columnId.toString()
	const newColumnId = columnId?.toString()

	const isMovingToDifferentColumn =
		newColumnId && newColumnId !== currentColumnId

	if (isMovingToDifferentColumn) {
		await Column.findByIdAndUpdate(currentColumnId, {
			$pull: { jobApplications: id },
		})

		const jobsInTargetColumn = await JobApplication.find({
			columnId: newColumnId,
			_id: { $ne: id },
		})
			.sort({ order: 1 })
			.lean()

		let newOrderValue: number

		if (order !== undefined && order !== null) {
			newOrderValue = order * 100

			const jobsThatNeedToShift = jobsInTargetColumn.slice(order)
			for (const job of jobsThatNeedToShift) {
				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: job.order + 100 },
				})
			}
		} else {
			if (jobsInTargetColumn.length > 0) {
				const lastJobOrder =
					jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0
				newOrderValue = lastJobOrder + 100
			} else {
				newOrderValue = 0
			}
		}

		updatesToApply.columnId = newColumnId
		updatesToApply.order = newOrderValue

		await Column.findByIdAndUpdate(newColumnId, {
			$push: { jobApplications: id },
		})
	} else if (order !== undefined && order !== null) {
		const otherJobsInColumn = await JobApplication.find({
			columnId: currentColumnId,
			_id: { $ne: id },
		})
			.sort({ order: 1 })
			.lean()

		const currentJobOrder = jobApplication.order || 0
		const currentPositionIndex = otherJobsInColumn.findIndex(
			(job) => job.order > currentJobOrder,
		)
		const oldPositionindex =
			currentPositionIndex === -1
				? otherJobsInColumn.length
				: currentPositionIndex

		const newOrderValue = order * 100

		if (order < oldPositionindex) {
			const jobsToShiftDown = otherJobsInColumn.slice(order, oldPositionindex)

			for (const job of jobsToShiftDown) {
				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: job.order + 100 },
				})
			}
		} else if (order > oldPositionindex) {
			const jobsToShiftUp = otherJobsInColumn.slice(oldPositionindex, order)
			for (const job of jobsToShiftUp) {
				const newOrder = Math.max(0, job.order - 100)
				await JobApplication.findByIdAndUpdate(job._id, {
					$set: { order: newOrder },
				})
			}
		}

		updatesToApply.order = newOrderValue
	}

	const updated = await JobApplication.findByIdAndUpdate(id, updatesToApply, {
		new: true,
	})

	revalidatePath("/dashboard")

	return { data: JSON.parse(JSON.stringify(updated)) }
}

export async function deleteJobApplication(id: string) {
	const session = await getSession()
	if (!session?.user) {
		return { error: "Unauthorized" }
	}

	await connectDB()

	const jobApplication = await JobApplication.findById(id)

	if (!jobApplication) {
		return { error: "Job application not found" }
	}

	if (jobApplication.userId !== session.user.id) {
		return { error: "Unauthorized" }
	}

	await Column.findByIdAndUpdate(jobApplication.columnId, {
		$pull: { jobApplications: id },
	})

	await JobApplication.findByIdAndDelete(id)

	revalidatePath("/dashboard")

	return { success: true }
}
