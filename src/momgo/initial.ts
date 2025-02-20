import type Elysia from "elysia"
import mongoose from "mongoose"

export const MongoInitial = (app: Elysia) =>
	app.onStart(async () => {
		mongoose.connect("mongodb://localhost:27017/mydb")
			.then(() => console.log("✅ MongoDB connected successfully!"))
			.catch(err => console.error("❌ MongoDB connection error:", err));
	})
