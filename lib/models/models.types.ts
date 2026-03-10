export type ApplicationStatus =
	| "wishlist"
	| "applied"
	| "interview"
	| "offer"
	| "rejected"

export interface JobApplication {
	_id: string
	company: string
	position: string
	location?: string
	status: ApplicationStatus
	columnId: string
	boardId: string
	userId: string
	order: number
	notes?: string
	salary?: string
	jobUrl?: string
	appliedDate?: string
	tags?: string[]
	description?: string
	createdAt: string
	updatedAt: string
}

export interface Column {
	_id: string
	name: string
	boardId: string
	order: number
	jobApplications: string[]
	createdAt: string
	updatedAt: string
}

export interface Board {
	_id: string
	name: string
	userId: string
	columns: string[]
	createdAt: string
	updatedAt: string
}
