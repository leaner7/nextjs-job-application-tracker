import { LayoutDashboard } from "lucide-react"

export default function DashboardLoading() {
	return (
		<div className="flex flex-col h-[calc(100vh-65px)] pt-[65px]">
			{/* Fake Page header */}
			<div className="px-6 py-4 border-b border-border bg-white flex items-center justify-between shrink-0">
				<div className="flex items-center gap-2">
					<LayoutDashboard className="size-5 text-primary opacity-50" />
					<div className="h-6 w-32 bg-slate-200 animate-pulse rounded"></div>
				</div>
				<div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
			</div>

			{/* Fake Board */}
			<div className="flex-1 overflow-hidden px-6 py-4">
				<div className="flex gap-4 h-full overflow-x-auto pb-4">
					{[1, 2, 3, 4, 5].map((i) => (
						<div
							key={i}
							className="flex flex-col shrink-0 w-72 bg-muted/50 rounded-xl border border-border border-t-4 border-t-slate-200"
						>
							{/* Fake Column header */}
							<div className="flex items-center justify-between px-3 pt-3 pb-2">
								<div className="flex items-center gap-2">
									<div className="h-5 w-20 bg-slate-200 animate-pulse rounded"></div>
									<div className="h-4 w-6 bg-slate-200 animate-pulse rounded-full"></div>
								</div>
								<div className="size-7 bg-slate-200 animate-pulse rounded-md"></div>
							</div>

							{/* Fake Cards */}
							<div className="flex flex-col gap-2 px-3 pb-3 overflow-y-auto flex-1">
								{[1, 2].map((j) => (
									<div
										key={j}
										className="h-24 bg-white rounded-lg border border-border animate-pulse"
									></div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
