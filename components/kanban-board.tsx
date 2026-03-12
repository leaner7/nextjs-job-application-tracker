"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BoardData } from "@/lib/dal/board"
import type { JobApplication } from "@/lib/models/models.types"
import CreateJobDialog from "@/components/create-job-dialog"
import JobApplicationCard from "@/components/job-application-card"
import { useBoard } from "@/lib/hooks/useBoard"

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

function SortableJobCard({ job, columns }: { job: JobApplication; columns: { _id: string; name: string }[] }) {
	return <JobApplicationCard job={job} columns={columns} />
}

export default function KanbanBoard({ board }: { board: BoardData }) {
	const { columns, moveJob } = useBoard(board)

	const [dialogColumn, setDialogColumn] = useState<{
		id: string
		name: string
	} | null>(null)

	return (
		<>
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
							<div className="flex flex-col gap-2 px-3 pb-3 overflow-y-auto flex-1 min-h-[120px] max-h-[calc(100vh-220px)]">
								{column.jobs.length === 0 ? (
									<div className="flex flex-col items-center justify-center flex-1 py-6 text-muted-foreground">
										<p className="text-xs">No applications yet</p>
									</div>
								) : (
									column.jobs.map((job) => (
										<SortableJobCard key={job._id} job={job} columns={board.columns} />
									))
								)}
							</div>
						</div>
					)
				})}
			</div>

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
