import type Elysia from "elysia"
import mongoose from "mongoose"

export const MongoInitial = (app: Elysia) =>
	app.onStart(async () => {
		const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/mydb"
		mongoose.connect(mongoUri)
			.then(() => console.log("✅ MongoDB connected successfully!"))
			.catch(err => console.error("❌ MongoDB connection error:", err));
	})
