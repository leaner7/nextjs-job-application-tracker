import { connect, Types } from "mongoose"
import { Board, Column, JobApplication } from "./lib/models"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable")
}

const TARGET_USER_ID = "69a80a0384c76d7c3533e6d1"

async function seed() {
	try {
		console.log("Connecting to database...")
		await connect(MONGODB_URI as string)
		console.log("Connected successfully.")

		console.log(`Clearing existing data for user ${TARGET_USER_ID}...`)
		const existingBoards = await Board.find({ userId: TARGET_USER_ID })
		for (const board of existingBoards) {
			await Column.deleteMany({ boardId: board._id })
			await JobApplication.deleteMany({ boardId: board._id })
		}
		await Board.deleteMany({ userId: TARGET_USER_ID })

		console.log("Creating new board...")
		const board = await Board.create({
			name: "Software Engineer Hunt 2026",
			userId: TARGET_USER_ID,
			columns: [],
		})

		console.log("Creating columns...")
		const columnsData = [
			{ name: "Wishlist", order: 0 },
			{ name: "Applied", order: 1 },
			{ name: "Interview", order: 2 },
			{ name: "Offer", order: 3 },
			{ name: "Rejected", order: 4 },
		]

		const createdColumns = []
		for (const colData of columnsData) {
			const column = await Column.create({
				...colData,
				boardId: board._id,
				jobApplications: [],
			})
			createdColumns.push(column)
			board.columns.push(column._id as Types.ObjectId) // Type assertion needed for TS
		}
		await board.save()

		console.log("Creating job applications...")
		// Helper function to get a date a few days ago
		const getPastDate = (daysAgo: number) => {
			const date = new Date()
			date.setDate(date.getDate() - daysAgo)
			return date
		}

		// 1. Wishlist Jobs
		const wishlistColId = createdColumns[0]._id
		const wishlistJobs = await JobApplication.insertMany([
			{
				company: "Google",
				position: "Senior Frontend Engineer",
				location: "Mountain View, CA",
				salary: "$180k - $250k",
				jobUrl: "https://careers.google.com",
				status: "wishlist",
				columnId: wishlistColId,
				boardId: board._id,
				userId: TARGET_USER_ID,
				order: 0,
				notes: "Need to review system design before applying.",
				tags: ["React", "TypeScript", "Performance"],
			},
			{
				company: "Stripe",
				position: "Full Stack Developer",
				location: "Remote",
				salary: "$160k - $210k",
				status: "wishlist",
				columnId: wishlistColId,
				boardId: board._id,
				userId: TARGET_USER_ID,
				order: 1,
				tags: ["Next.js", "Financial"],
			},
		])
		await Column.findByIdAndUpdate(wishlistColId, {
			$push: { jobApplications: { $each: wishlistJobs.map((j) => j._id) } },
		})

		// 2. Applied Jobs
		const appliedColId = createdColumns[1]._id
		const appliedJobs = await JobApplication.insertMany([
			{
				company: "Vercel",
				position: "Developer Success Engineer",
				location: "Remote",
				jobUrl: "https://vercel.com/careers",
				status: "applied",
				columnId: appliedColId,
				boardId: board._id,
				userId: TARGET_USER_ID,
				order: 0,
				appliedDate: getPastDate(2),
				tags: ["Next.js", "Customer Facing"],
			},
			{
				company: "Netflix",
				position: "UI Engineer",
				location: "Los Gatos, CA",
				salary: "$250k+",
				status: "applied",
				columnId: appliedColId,
				boardId: board._id,
				userId: TARGET_USER_ID,
				order: 1,
				appliedDate: getPastDate(5),
				notes: "Applied via referral from Sarah.",
				tags: ["React", "RxJS"],
			},
			{
				company: "Spotify",
				position: "Web Engineer",
				location: "New York, NY",
				status: "applied",
				columnId: appliedColId,
				boardId: board._id,
				userId: TARGET_USER_ID,
				order: 2,
				appliedDate: getPastDate(12),
				tags: ["Music", "React"],
			},
		])
		await Column.findByIdAndUpdate(appliedColId, {
			$push: { jobApplications: { $each: appliedJobs.map((j) => j._id) } },
		})

		// 3. Interviewing Jobs
		const interviewColId = createdColumns[2]._id
		const interviewJobs = await JobApplication.insertMany([
			{
				company: "Airbnb",
				position: "Frontend Engineer, Guest Experience",
				location: "San Francisco, CA",
				salary: "$170k - $220k",
				status: "interview",
				columnId: interviewColId,
				boardId: board._id,
				userId: TARGET_USER_ID,
				order: 0,
				appliedDate: getPastDate(20),
				notes: "First round passed. Technical interview scheduled for next Tuesday.",
				tags: ["React", "Travel"],
			},
		])
		await Column.findByIdAndUpdate(interviewColId, {
			$push: { jobApplications: { $each: interviewJobs.map((j) => j._id) } },
		})

		// 4. Offer
		const offerColId = createdColumns[3]._id
		const offerJobs = await JobApplication.insertMany([
			{
				company: "Discord",
				position: "Software Engineer, Web",
				location: "San Francisco, CA (Hybrid)",
				salary: "$185,000 + Equity",
				status: "offer",
				columnId: offerColId,
				boardId: board._id,
				userId: TARGET_USER_ID,
				order: 0,
				appliedDate: getPastDate(45),
				notes: "Received offer! Deadline to accept is Friday.",
				tags: ["React", "WebRTC"],
			},
		])
		await Column.findByIdAndUpdate(offerColId, {
			$push: { jobApplications: { $each: offerJobs.map((j) => j._id) } },
		})

		// 5. Rejected
		const rejectedColId = createdColumns[4]._id
		const rejectedJobs = await JobApplication.insertMany([
			{
				company: "Meta",
				position: "Frontend Engineer",
				location: "Menlo Park, CA",
				status: "rejected",
				columnId: rejectedColId,
				boardId: board._id,
				userId: TARGET_USER_ID,
				order: 0,
				appliedDate: getPastDate(30),
				notes: "Auto-reject email.",
				tags: ["React"],
			},
		])
		await Column.findByIdAndUpdate(rejectedColId, {
			$push: { jobApplications: { $each: rejectedJobs.map((j) => j._id) } },
		})

		console.log("🎉 Seeding completed successfully!")
		process.exit(0)
	} catch (error) {
		console.error("❌ Error seeding database:", error)
		process.exit(1)
	}
}

seed()
