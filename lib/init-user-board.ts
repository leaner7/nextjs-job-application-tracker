import connectDB from "@/lib/db"
import { Board, Column } from "@/lib/models"

const DEFAULT_COLUMNS = [
	{ name: "Wishlist", order: 0 },
	{ name: "Applied", order: 1 },
	{ name: "Interview", order: 2 },
	{ name: "Offer", order: 3 },
	{ name: "Rejected", order: 4 },
]

export async function initUserBoard(userId: string) {
	await connectDB()

	// Skip if the user already has a board
	const existing = await Board.findOne({ userId })
	if (existing) return existing

	// Create the board
	const board = await Board.create({
		name: "My Board",
		userId,
		columns: [],
	})

	// Create default columns referencing the board
	const columns = await Column.insertMany(
		DEFAULT_COLUMNS.map((col) => ({
			...col,
			boardId: board._id,
			jobApplications: [],
		})),
	)

	// Link column IDs back to the board
	board.columns = columns.map((col) => col._id)
	await board.save()

	return board
}
