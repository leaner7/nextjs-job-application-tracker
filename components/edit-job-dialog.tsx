"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { updateJobApplication } from "@/lib/actions/job-applications"
import { createJobFormSchema } from "@/lib/validations"
import { JobApplication } from "@/lib/models/models.types"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"


type FormValues = z.infer<typeof createJobFormSchema>

interface EditJobDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	job: JobApplication
}

export default function EditJobDialog({
	open,
	onOpenChange,
	job,
}: EditJobDialogProps) {
	const [serverError, setServerError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(createJobFormSchema),
		defaultValues: {
			company: job.company || "",
			position: job.position || "",
			location: job.location || "",
			salary: job.salary || "",
			jobUrl: job.jobUrl || "",
			appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : "",
			notes: job.notes || "",
			description: job.description || "",
			tags: job.tags ? job.tags.join(", ") : "",
		},
	})

	async function onSubmit(values: FormValues) {
		setServerError(null)

		const tags = values.tags
			? values.tags
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean)
			: []
			
		const updateData = {
			...values,
			tags,
		}

		// We use updateJobApplication from lib/actions/job-applications.ts
		const result = await updateJobApplication(job._id, updateData)

		if (result.error) {
			setServerError(result.error)
			return
		}

		onOpenChange(false)
	}

	function handleClose(value: boolean) {
		if (!value) {
			// Don't fully reset on close because we want it populated with original job info
			setServerError(null)
			reset({
				company: job.company || "",
				position: job.position || "",
				location: job.location || "",
				salary: job.salary || "",
				jobUrl: job.jobUrl || "",
				appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : "",
				notes: job.notes || "",
				description: job.description || "",
				tags: job.tags ? job.tags.join(", ") : "",
			})
		}
		onOpenChange(value)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Edit Application</DialogTitle>
					<DialogDescription>
						Update details for <span className="font-semibold">{job.position}</span> at <span className="font-semibold">{job.company}</span>
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 mt-2"
				>
					{/* Company & Position — required */}
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="company">
								Company <span className="text-destructive">*</span>
							</Label>
							<Input
								id="company"
								placeholder="Google"
								{...register("company")}
							/>
							{errors.company && (
								<p className="text-xs text-destructive">
									{errors.company.message}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="position">
								Position <span className="text-destructive">*</span>
							</Label>
							<Input
								id="position"
								placeholder="Software Engineer"
								{...register("position")}
							/>
							{errors.position && (
								<p className="text-xs text-destructive">
									{errors.position.message}
								</p>
							)}
						</div>
					</div>

					{/* Location & Salary */}
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								placeholder="Remote / New York, NY"
								{...register("location")}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="salary">Salary</Label>
							<Input
								id="salary"
								placeholder="80k - 120k"
								{...register("salary")}
							/>
						</div>
					</div>

					{/* Job URL & Applied Date */}
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="jobUrl">Job URL</Label>
							<Input
								id="jobUrl"
								placeholder="https://..."
								{...register("jobUrl")}
							/>
							{errors.jobUrl && (
								<p className="text-xs text-destructive">
									{errors.jobUrl.message}
								</p>
							)}
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="appliedDate">Applied Date</Label>
							<Input
								id="appliedDate"
								type="date"
								{...register("appliedDate")}
							/>
						</div>
					</div>

					{/* Tags */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="tags">Tags</Label>
						<Input
							id="tags"
							placeholder="react, typescript, remote (comma-separated)"
							{...register("tags")}
						/>
					</div>

					{/* Description */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Job description or requirements..."
							rows={2}
							{...register("description")}
						/>
					</div>

					{/* Notes */}
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="notes">Notes</Label>
						<Textarea
							id="notes"
							placeholder="Your personal notes..."
							rows={2}
							{...register("notes")}
						/>
					</div>

					{/* Server error */}
					{serverError && (
						<p className="text-sm text-destructive">{serverError}</p>
					)}

					{/* Submit */}
					<div className="flex justify-end gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleClose(false)}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="bg-rose-400 hover:bg-rose-500 text-white"
						>
							{isSubmitting ? "Saving..." : "Save Changes"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
