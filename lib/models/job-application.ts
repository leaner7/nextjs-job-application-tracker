import mongoose, { Schema, Document } from "mongoose"

export type ApplicationStatus =
	| "wishlist"
	| "applied"
	| "interview"
	| "offer"
	| "rejected"

export interface IJobApplication extends Document {
	company: string
	position: string
	location?: string
	status: ApplicationStatus
	columnId: mongoose.Types.ObjectId
	boardId: mongoose.Types.ObjectId
	userId: string
	order: number
	notes?: string
	salary?: string
	jobUrl?: string
	appliedDate?: Date
	tags?: string[]
	description?: string
	createdAt: Date
	updatedAt: Date
}

const JobApplicationSchema = new Schema<IJobApplication>(
	{
		company: {
			type: String,
			required: true,
			trim: true,
		},
		position: {
			type: String,
			required: true,
			trim: true,
		},
		location: {
			type: String,
			trim: true,
		},
		status: {
			type: String,
			enum: ["wishlist", "applied", "interview", "offer", "rejected"],
			required: true,
			default: "applied",
		},
		columnId: {
			type: Schema.Types.ObjectId,
			ref: "Column",
			required: true,
			index: true,
		},
		boardId: {
			type: Schema.Types.ObjectId,
			ref: "Board",
			required: true,
			index: true,
		},
		userId: {
			type: String,
			required: true,
			index: true,
		},
		order: {
			type: Number,
			required: true,
			default: 0,
		},
		notes: {
			type: String,
			trim: true,
		},
		salary: {
			type: String,
			trim: true,
		},
		jobUrl: {
			type: String,
			trim: true,
		},
		appliedDate: {
			type: Date,
		},
		tags: {
			type: [String],
			default: [],
		},
		description: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true },
)

export default mongoose.models.JobApplication ||
	mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema)
