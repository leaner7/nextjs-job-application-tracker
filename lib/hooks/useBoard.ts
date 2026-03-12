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

	function moveJob(
		activeId: string,
		overId: string,
		isOverJob: boolean,
		isOverColumn: boolean,
	) {
		setColumns((prevColumns) => {
			const newColumns = prevColumns.map((c) => ({
				...c,
				jobs: [...c.jobs],
			}))

			// Find source column index
			const activeColumnIndex = newColumns.findIndex((c) =>
				c.jobs.some((j) => j._id === activeId),
			)
			if (activeColumnIndex === -1) return prevColumns

			if (isOverJob) {
				const overColumnIndex = newColumns.findIndex((c) =>
					c.jobs.some((j) => j._id === overId),
				)
				if (overColumnIndex === -1) return prevColumns

				const activeIndex = newColumns[activeColumnIndex].jobs.findIndex(
					(j) => j._id === activeId,
				)
				const overIndex = newColumns[overColumnIndex].jobs.findIndex(
					(j) => j._id === overId,
				)

				if (activeColumnIndex === overColumnIndex) {
					// Moving in the same column
					const items = [...newColumns[activeColumnIndex].jobs]
					const [reorderedItem] = items.splice(activeIndex, 1)
					items.splice(overIndex, 0, reorderedItem)

					// Re-assign order locally to avoid flickering
					items.forEach((item, index) => {
						item.order = index * 100
					})

					newColumns[activeColumnIndex].jobs = items
				} else {
					// Moving to a different column
					const [removed] = newColumns[activeColumnIndex].jobs.splice(
						activeIndex,
						1,
					)
					removed.columnId = newColumns[overColumnIndex]._id // Update the local state's representation of columnId
					newColumns[overColumnIndex].jobs.splice(overIndex, 0, removed)

					// Re-assign order locally in the new column
					newColumns[overColumnIndex].jobs.forEach((item, index) => {
						item.order = index * 100
					})

					// Re-assign order locally in the old column
					newColumns[activeColumnIndex].jobs.forEach((item, index) => {
						item.order = index * 100
					})
				}

				return newColumns
			}

			if (isOverColumn) {
				const overColumnIndex = newColumns.findIndex((c) => c._id === overId)
				if (overColumnIndex === -1 || activeColumnIndex === overColumnIndex)
					return prevColumns

				const activeIndex = newColumns[activeColumnIndex].jobs.findIndex(
					(j) => j._id === activeId,
				)

				// Move to the end of the new column
				const [removed] = newColumns[activeColumnIndex].jobs.splice(
					activeIndex,
					1,
				)
				removed.columnId = newColumns[overColumnIndex]._id
				newColumns[overColumnIndex].jobs.push(removed)

				// Re-assign order locally in the new column
				newColumns[overColumnIndex].jobs.forEach((item, index) => {
					item.order = index * 100
				})

				// Re-assign order locally in the old column
				newColumns[activeColumnIndex].jobs.forEach((item, index) => {
					item.order = index * 100
				})

				return newColumns
			}

			return prevColumns
		})
	}

	return {
		board,
		columns,
		error,
		moveJob,
	}
}
