"use client"

import { useState } from "react"
import { BoardData } from "../dal/board"

export function useBoard(initialBoard?: BoardData) {
	const [prevInitialBoard, setPrevInitialBoard] = useState(initialBoard)
	const [board, setBoard] = useState<BoardData | null>(initialBoard || null)
	const [columns, setColumns] = useState<BoardData["columns"]>(
		initialBoard?.columns || [],
	)
	const [error, setError] = useState<string | null>(null)

	// Update state during render if the initialBoard prop changes.
	// This avoids the cascading render problem caused by useEffect.
	if (initialBoard !== prevInitialBoard) {
		setPrevInitialBoard(initialBoard)
		if (initialBoard) {
			setBoard(initialBoard)
			setColumns(initialBoard.columns)
		}
	}

	async function moveJob(
		jobApplicationId: string,
		newColumnId: string,
		newOrder: number,
	) {}

	return {
		board,
		columns,
		error,
		moveJob,
	}
}
