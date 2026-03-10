

import connectDB from "@/lib/db"
import { Board, JobApplication } from "@/lib/models"
import type {
	Board as BoardType,
	Column as ColumnType,
	JobApplication as JobApplicationType,
} from "@/lib/models/models.types"

export interface BoardData {
	board: BoardType
	columns: (ColumnType & { jobs: JobApplicationType[] })[]
}

export async function getBoardData(userId: string): Promise<BoardData | null> {
	if (!userId) return null

	await connectDB()

	const board = await Board.findOne({ userId })
		.populate({
			path: "columns",
			options: { sort: { order: 1 } },
		})
		.lean()

	if (!board) return null

	const populatedColumns =
		(board.columns as unknown as Array<{
			_id: { toString(): string }
			name: string
			boardId: { toString(): string }
			order: number
			jobApplications: { toString(): string }[]
			createdAt: Date
			updatedAt: Date
		}>) || []
	const columnIds = populatedColumns.map((c) => c._id)

	const jobs = await JobApplication.find({ columnId: { $in: columnIds } })
		.sort({ order: 1 })
		.lean()

	const columnsWithJobs = populatedColumns.map((col) => ({
		...col,
		_id: col._id.toString(),
		boardId: col.boardId.toString(),
		jobApplications: (col.jobApplications || []).map((id: { toString(): string }) =>
			id.toString(),
		),
		createdAt: col.createdAt.toISOString(),
		updatedAt: col.updatedAt.toISOString(),
		jobs: jobs
			.filter((j) => j.columnId.toString() === col._id.toString())
			.map((j) => ({
				...j,
				_id: j._id.toString(),
				columnId: j.columnId.toString(),
				boardId: j.boardId.toString(),
				appliedDate: j.appliedDate?.toISOString(),
				createdAt: j.createdAt.toISOString(),
				updatedAt: j.updatedAt.toISOString(),
			})),
	}))

	return {
		board: {
			...board,
			_id: board._id.toString(),
			columns: populatedColumns.map((c) => c._id.toString()),
			createdAt: board.createdAt.toISOString(),
			updatedAt: board.updatedAt.toISOString(),
		},
		columns: columnsWithJobs,
	}
}
