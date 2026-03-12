"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BoardData } from "@/lib/dal/board"
import type { JobApplication } from "@/lib/models/models.types"
import CreateJobDialog from "@/components/create-job-dialog"
import JobApplicationCard from "@/components/job-application-card"
import { useBoard } from "@/lib/hooks/useBoard"
import { updateJobApplication } from "@/lib/actions/job-applications"

import {
	DndContext,
	DragOverlay,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragOverEvent,
	DragEndEvent,
	defaultDropAnimationSideEffects,
	useDroppable,
} from "@dnd-kit/core"
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const STATUS_COLORS: Record<string, string> = {
	wishlist: "bg-slate-100 text-slate-700 border-slate-200",
	applied: "bg-blue-50 text-blue-700 border-blue-200",
	interview: "bg-amber-50 text-amber-700 border-amber-200",
	offer: "bg-emerald-50 text-emerald-700 border-emerald-200",
	rejected: "bg-red-50 text-red-700 border-red-200",
}

const COLUMN_ACCENT: Record<string, string> = {
	wishlist: "border-t-slate-400",
	applied: "border-t-blue-400",
	interview: "border-t-amber-400",
	offer: "border-t-emerald-400",
	rejected: "border-t-red-400",
}

function SortableJobCard({
	job,
	columns,
}: {
	job: JobApplication
	columns: { _id: string; name: string }[]
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: job._id,
		data: {
			type: "Job",
			job,
		},
	})

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<div className="pointer-events-auto">
				<JobApplicationCard job={job} columns={columns} />
			</div>
		</div>
	)
}

function DroppableColumn({
	column,
	children,
}: {
	column: { _id: string; name: string; jobs: JobApplication[] }
	children: React.ReactNode
}) {
	const { setNodeRef, isOver } = useDroppable({
		id: column._id,
		data: {
			type: "Column",
			column,
		},
	})

	return (
		<div
			ref={setNodeRef}
			className={`flex flex-col gap-2 px-3 pb-3 overflow-y-auto flex-1 min-h-[120px] max-h-[calc(100vh-220px)] transition-colors ${
				isOver ? "bg-muted-foreground/10 rounded-md" : ""
			}`}
		>
			<SortableContext
				items={column.jobs.map((j) => j._id)}
				strategy={verticalListSortingStrategy}
			>
				{children}
			</SortableContext>
		</div>
	)
}

export default function KanbanBoard({ board }: { board: BoardData }) {
	const { columns, moveJob } = useBoard(board)

	const [dialogColumn, setDialogColumn] = useState<{
		id: string
		name: string
	} | null>(null)

	const [activeJob, setActiveJob] = useState<JobApplication | null>(null)

	// Configure sensors (pointer config to avoid capturing standard clicks)
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	)

	function handleDragStart(event: DragStartEvent) {
		const { active } = event
		if (active.data.current?.type === "Job") {
			setActiveJob(active.data.current.job)
		}
	}

	function handleDragOver(event: DragOverEvent) {
		const { active, over } = event
		if (!over) return

		const activeId = active.id.toString()
		const overId = over.id.toString()

		if (activeId === overId) return

		const isActiveJob = active.data.current?.type === "Job"
		const isOverJob = over.data.current?.type === "Job"
		const isOverColumn = over.data.current?.type === "Column"

		if (!isActiveJob) return

		moveJob(activeId, overId, isOverJob, isOverColumn)
	}

	async function handleDragEnd(event: DragEndEvent) {
		setActiveJob(null)
		const { active, over } = event
		if (!over) return

		const activeId = active.id.toString()

		// Find current state after drag over has completed optimistically
		const activeColumn = columns.find((c) =>
			c.jobs.some((j) => j._id === activeId),
		)
		if (!activeColumn) return

		const activeIndex = activeColumn.jobs.findIndex((j) => j._id === activeId)
		const newColumnId = activeColumn._id

		try {
			// Persist the changes via server action
			await updateJobApplication(activeId, {
				columnId: newColumnId,
				order: activeIndex, 
			})
		} catch (error) {
			console.error("Failed to persist job position:", error)
		}
	}

	const dropAnimation = {
		sideEffects: defaultDropAnimationSideEffects({
			styles: {
				active: {
					opacity: "0.5",
				},
			},
		}),
	}

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
			>
				<div className="flex gap-4 h-full overflow-x-auto pb-4">
					{columns.map((column) => {
						const columnKey = column.name.toLowerCase()
						const accentClass =
							COLUMN_ACCENT[columnKey] ?? "border-t-gray-300"
						const statusClass =
							STATUS_COLORS[columnKey] ?? "bg-gray-100 text-gray-700"

						return (
							<div
								key={column._id}
								className={`flex flex-col shrink-0 w-72 bg-muted/50 rounded-xl border border-border border-t-4 ${accentClass}`}
							>
								{/* Column header */}
								<div className="flex items-center justify-between px-3 pt-3 pb-2">
									<div className="flex items-center gap-2">
										<span className="font-semibold text-sm text-foreground">
											{column.name}
										</span>
										<span
											className={`text-xs font-medium px-1.5 py-0.5 rounded-full border ${statusClass}`}
										>
											{column.jobs.length}
										</span>
									</div>
									<Button
										size="icon"
										variant="ghost"
										className="size-7 text-muted-foreground hover:text-foreground"
										onClick={() =>
											setDialogColumn({
												id: column._id,
												name: column.name,
											})
										}
									>
										<Plus className="size-4" />
									</Button>
								</div>

								{/* Cards */}
								<DroppableColumn column={column}>
									{column.jobs.length === 0 ? (
										<div className="flex flex-col items-center justify-center flex-1 py-6 text-muted-foreground pointer-events-none">
											<p className="text-xs">No applications yet</p>
										</div>
									) : (
										column.jobs.map((job) => (
											<SortableJobCard
												key={job._id}
												job={job}
												columns={board.columns}
											/>
										))
									)}
								</DroppableColumn>
							</div>
						)
					})}
				</div>

				<DragOverlay dropAnimation={dropAnimation}>
					{activeJob ? (
						<JobApplicationCard job={activeJob} columns={board.columns} />
					) : null}
				</DragOverlay>
			</DndContext>

			<CreateJobDialog
				open={dialogColumn !== null}
				onOpenChange={(open) => {
					if (!open) setDialogColumn(null)
				}}
				columnId={dialogColumn?.id ?? ""}
				boardId={board.board._id}
				columnName={dialogColumn?.name ?? ""}
			/>
		</>
	)
}
