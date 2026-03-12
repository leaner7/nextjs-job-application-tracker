import { Briefcase, MapPin, DollarSign, MoreVertical, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import type { JobApplication } from "@/lib/models/models.types"
import { updateJobApplication, deleteJobApplication } from "@/lib/actions/job-applications"
import EditJobDialog from "./edit-job-dialog"

interface JobApplicationCardProps {
	job: JobApplication
	columns: { _id: string; name: string }[]
}

export default function JobApplicationCard({
	job,
	columns,
}: JobApplicationCardProps) {
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const otherColumns = columns.filter((col) => col._id !== job.columnId)

	async function handleMove(newColumnId: string) {
		try {
			await updateJobApplication(job._id, {
				columnId: newColumnId
			})
		} catch (error) {
			console.error(error)
		}
	}

	async function handleDelete() {
		try {
			setIsDeleting(true)
			await deleteJobApplication(job._id)
		} catch (error) {
			console.error(error)
		} finally {
			setIsDeleting(false)
			setIsDeleteDialogOpen(false)
		}
	}

	return (
		<>
		<Card className="group relative overflow-hidden bg-white/40 dark:bg-card/40 backdrop-blur-sm border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out py-4">
			{/* Hover highlight effect */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
			
			<CardContent className="px-5 relative z-10">
			<div className="flex items-start justify-between gap-3 mb-3">
				<div className="min-w-0">
					<p className="font-bold text-sm tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
						{job.position}
					</p>
					<div className="flex items-center gap-1.5 mt-1">
						<div className="bg-primary/10 p-1 rounded-md">
							<Briefcase className="size-3 text-primary shrink-0 transition-transform group-hover:scale-110" />
						</div>
						<p className="text-[11px] font-bold text-muted-foreground/80 truncate">
							{job.company}
						</p>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className="size-7 transition-all rounded-full hover:bg-background/80"
						>
							<MoreVertical className="size-4 text-muted-foreground" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-52 mt-1 backdrop-blur-xl bg-background/90">
						<DropdownMenuItem className="flex items-center gap-2.5 py-2 cursor-pointer transition-colors" onClick={() => setIsEditDialogOpen(true)}>
							<Pencil className="size-4 opacity-70" />
							<span className="text-sm font-medium">Edit details</span>
						</DropdownMenuItem>
						<DropdownMenuItem 
							className="flex items-center gap-2.5 py-2 cursor-pointer text-rose-500 focus:text-rose-500 focus:bg-rose-500/10" 
							onClick={() => setIsDeleteDialogOpen(true)}
						>
							<Trash2 className="size-4" />
							<span className="text-sm font-medium">Delete application</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator className="bg-border/40" />
						<div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
							Move Stage
						</div>
						{otherColumns.map((col) => (
							<DropdownMenuItem key={col._id} className="py-2 cursor-pointer" onClick={() => handleMove(col._id)}>
								<span className="text-sm font-medium">To {col.name}</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex flex-col gap-1.5 mb-3">
				{job.location && (
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
						<MapPin className="size-3.5 opacity-60" />
						<span className="font-medium truncate">{job.location}</span>
					</div>
				)}
				{job.salary && (
					<div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
						<DollarSign className="size-3.5 opacity-80" />
						<span>{job.salary}</span>
					</div>
				)}
			</div>

			{job.tags && job.tags.length > 0 && (
				<div className="flex flex-wrap gap-1.5 mt-2">
					{job.tags.slice(0, 3).map((tag) => (
						<Badge
							key={tag}
							variant="outline"
							className="text-[10px] px-2 py-0.5 border-primary/20 bg-primary/5 text-primary font-bold transition-colors group-hover:bg-primary/10"
						>
							{tag}
						</Badge>
					))}
				</div>
			)}

			{job.appliedDate && (
				<div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/20">
					<div className="size-1.5 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" />
					<p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
						Applied{" "}
						{new Date(job.appliedDate).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
							year: "numeric"
						})}
					</p>
				</div>
			)}
			</CardContent>

			{isEditDialogOpen && (
				<EditJobDialog
					open={isEditDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					job={job}
				/>
			)}

			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the job application for <strong>{job.position}</strong> at <strong>{job.company}</strong>.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
						<Button 
							variant="destructive" 
							onClick={(e) => {
								e.preventDefault();
								handleDelete();
							}} 
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Card>
		</>
	)
}
