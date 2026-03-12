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

const COLUMNS_CONFIG: Record<string, { accent: string; status: string; dot: string }> = {
	wishlist: { 
		accent: "border-t-slate-400 dark:border-t-slate-600", 
		status: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800",
		dot: "bg-slate-400"
	},
	applied: { 
		accent: "border-t-blue-500 dark:border-t-blue-600", 
		status: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
		dot: "bg-blue-500"
	},
	interview: { 
		accent: "border-t-amber-500 dark:border-t-amber-600", 
		status: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
		dot: "bg-amber-500"
	},
	offer: { 
		accent: "border-t-emerald-500 dark:border-t-emerald-600", 
		status: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
		dot: "bg-emerald-500"
	},
	rejected: { 
		accent: "border-t-rose-500 dark:border-t-rose-600", 
		status: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
		dot: "bg-rose-500"
	},
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
				<div className="flex gap-8 h-full overflow-x-auto pb-8 pt-4 scrollbar-none antialiased">
					{columns.map((column) => {
						const columnKey = column.name.toLowerCase()
						const config = COLUMNS_CONFIG[columnKey] ?? {
							accent: "border-t-border",
							status: "bg-muted text-muted-foreground border-border",
							dot: "bg-muted-foreground",
						}
						const accentClass = config.accent

						return (
							<div
								key={column._id}
								className={`flex flex-col shrink-0 w-[340px] bg-secondary/20 dark:bg-card/20 backdrop-blur-md rounded-2xl border border-border/40 border-t-4 shadow-sm group/column transition-all duration-300 ${accentClass}`}
							>
								{/* Column header */}
								<div className="flex items-center justify-between px-5 pt-5 pb-3">
									<div className="flex items-center gap-3">
										<div className={`size-2.5 rounded-full ring-4 ring-background/50 ${config.dot}`} />
										<span className="font-bold tracking-tight text-sm text-foreground/90 uppercase">
											{column.name}
										</span>
										<span
											className={`text-[10px] font-black px-2 py-0.5 rounded-full border shadow-inner ${config.status}`}
										>
											{column.jobs.length}
										</span>
									</div>
									<Button
										size="icon"
										variant="ghost"
										className="size-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all"
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
										<div className="flex flex-col items-center justify-center flex-1 py-16 text-muted-foreground/40 border-2 border-dashed border-border/10 rounded-2xl m-3 pointer-events-none transition-colors group-hover/column:border-border/30">
											<p className="text-[11px] font-bold tracking-widest uppercase">Stage Empty</p>
										</div>
									) : (
										<div className="flex flex-col gap-3">
											{column.jobs.map((job) => (
												<SortableJobCard
													key={job._id}
													job={job}
													columns={board.columns}
												/>
											))}
										</div>
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
