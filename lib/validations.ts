import { z } from "zod"

export const createJobFormSchema = z.object({
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
