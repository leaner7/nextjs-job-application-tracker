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
		<Card className="shadow-sm hover:shadow-md transition-shadow group py-3">
			<CardContent className="px-4">
			<div className="flex items-start justify-between gap-2 mb-2">
				<div className="min-w-0">
					<p className="font-medium text-sm text-foreground truncate">
						{job.position}
					</p>
					<div className="flex items-center gap-1 mt-0.5">
						<Briefcase className="size-3 text-muted-foreground shrink-0" />
						<p className="text-xs text-muted-foreground truncate">
							{job.company}
						</p>
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							size="icon"
							variant="ghost"
							className="size-6 text-muted-foreground shrink-0"
						>
							<MoreVertical className="size-3.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-48">
						<DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditDialogOpen(true)}>
							<Pencil className="size-3" />
							Edit
						</DropdownMenuItem>
						<DropdownMenuItem 
							className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" 
							onClick={() => setIsDeleteDialogOpen(true)}
						>
							<Trash2 className="size-3" />
							Delete
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						{otherColumns.map((col) => (
							<DropdownMenuItem key={col._id} className="cursor-pointer" onClick={() => handleMove(col._id)}>
								Move to {col.name}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="flex flex-wrap gap-1.5 mt-2">
				{job.location && (
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<MapPin className="size-3" />
						{job.location}
					</span>
				)}
				{job.salary && (
					<span className="flex items-center gap-1 text-xs text-muted-foreground">
						<DollarSign className="size-3" />
						{job.salary}
					</span>
				)}
			</div>

			{job.tags && job.tags.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-2">
					{job.tags.slice(0, 3).map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="text-xs px-1.5 py-0"
						>
							{tag}
						</Badge>
					))}
				</div>
			)}

			{job.appliedDate && (
				<p className="text-xs text-muted-foreground mt-2">
					Applied{" "}
					{new Date(job.appliedDate).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					})}
				</p>
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
