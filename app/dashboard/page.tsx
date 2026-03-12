import { getBoardData } from "@/lib/dal/board"
import KanbanBoard from "@/components/kanban-board"
import { LayoutDashboard } from "lucide-react"
import { getSession } from "@/lib/auth/auth"

export default async function DashboardPage() {
	const session = await getSession()
	
	const board = await getBoardData(session?.user.id ?? '')

	return (
		<div className="flex flex-col h-[calc(100vh-65px)] pt-[65px] bg-background">
			{/* Page header */}
			<div className="px-8 py-5 border-b border-border/50 bg-background/80 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
				<div className="flex items-center gap-4">
					<div className="bg-primary/10 p-2.5 rounded-2xl">
						<LayoutDashboard className="size-6 text-primary animate-pulse" />
					</div>
					<div>
						<h1 className="font-bold text-2xl tracking-tight text-foreground">
							{board?.board.name ?? "My Board"}
						</h1>
						<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/70 mt-0.5">
							Main Career Pipeline
						</p>
					</div>
				</div>
				
				<div className="flex items-center gap-6">
					<div className="flex flex-col items-end">
						<p className="text-xl font-black text-foreground tabular-nums">
							{board?.columns.reduce((acc, col) => acc + col.jobs.length, 0) ?? 0}
						</p>
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
							Active Trackers
						</p>
					</div>
					<div className="h-10 w-px bg-border/40 hidden md:block" />
					<div className="hidden md:flex flex-col items-end">
						<p className="text-xl font-black text-emerald-500 tabular-nums">
							{board?.columns.find(c => c.name.toLowerCase() === 'offer')?.jobs.length ?? 0}
						</p>
						<p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
							Offers Received
						</p>
					</div>
				</div>
			</div>

			{/* Board Content */}
			<div className="flex-1 overflow-hidden px-8 py-6">
				{board ? (
					<KanbanBoard board={board} />
				) : (
					<div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
						<div className="size-16 rounded-full bg-secondary flex items-center justify-center">
							<LayoutDashboard className="size-8 opacity-20" />
						</div>
						<p className="font-medium">Initializing workspace...</p>
					</div>
				)}
			</div>
		</div>
	)
}
