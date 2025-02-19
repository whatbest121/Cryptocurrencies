import { Schema, model } from "mongoose"

const schema = new Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },

})
export const UserModel = model("user", schema, "user")