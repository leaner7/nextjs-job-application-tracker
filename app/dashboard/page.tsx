import { getBoardData } from "@/lib/dal/board"
import KanbanBoard from "@/components/kanban-board"
import { LayoutDashboard } from "lucide-react"
import { getSession } from "@/lib/auth/auth"

export default async function DashboardPage() {
	const session = await getSession()
	
	const board = await getBoardData(session?.user.id ?? '')

	return (
		<div className="flex flex-col h-[calc(100vh-65px)] pt-[65px]">
			{/* Page header */}
			<div className="px-6 py-4 border-b border-border bg-white flex items-center justify-between shrink-0">
				<div className="flex items-center gap-2">
					<LayoutDashboard className="size-5 text-primary" />
					<h1 className="font-semibold text-lg">
						{board?.board.name ?? "My Board"}
					</h1>
				</div>
				<p className="text-sm text-muted-foreground">
					{board
						? `${board.columns.reduce((acc, col) => acc + col.jobs.length, 0)} applications`
						: ""}
				</p>
			</div>

			{/* Board */}
			<div className="flex-1 overflow-hidden px-6 py-4">
				{board ? (
					<KanbanBoard board={board} />
				) : (
					<div className="flex items-center justify-center h-full text-muted-foreground">
						<p>No board found.</p>
					</div>
				)}
			</div>
		</div>
	)
}
