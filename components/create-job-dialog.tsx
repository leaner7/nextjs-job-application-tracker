"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createJobApplication } from "@/lib/actions/job-applications"
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

const formSchema = z.object({
	company: z.string().min(1, "Company is required"),
	position: z.string().min(1, "Position is required"),
	location: z.string().optional(),
	salary: z.string().optional(),
	jobUrl: z.string().url("Invalid URL").or(z.literal("")).optional(),
	appliedDate: z.string().optional(),
	notes: z.string().optional(),
	description: z.string().optional(),
	tags: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateJobDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	columnId: string
	boardId: string
	columnName: string
}

export default function CreateJobDialog({
	open,
	onOpenChange,
	columnId,
	boardId,
	columnName,
}: CreateJobDialogProps) {
	const [serverError, setServerError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			company: "",
			position: "",
			location: "",
			salary: "",
			jobUrl: "",
			appliedDate: "",
			notes: "",
			description: "",
			tags: "",
		},
	})

	async function onSubmit(values: FormValues) {
		setServerError(null)

		const result = await createJobApplication({
			...values,
			columnId,
			boardId,
		})

		if (result.error) {
			setServerError(result.error)
			return
		}

		reset()
		onOpenChange(false)
	}

	function handleClose(value: boolean) {
		if (!value) {
			reset()
			setServerError(null)
		}
		onOpenChange(value)
	}

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Application</DialogTitle>
					<DialogDescription>
						Adding to <span className="font-semibold">{columnName}</span>
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
							{isSubmitting ? "Creating..." : "Create"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
