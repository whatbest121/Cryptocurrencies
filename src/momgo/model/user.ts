import { Schema, model } from "mongoose"

export const modelNameUser = "user"
const schema = new Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    fiat_balance: { type: Number, default: 0 },
    cryptocurrency_balance: {
        BTC: { type: Number, default: 0 },
        ETH: { type: Number, default: 0 },
        XRP: { type: Number, default: 0 },
        DOGE: { type: Number, default: 0 },
    },

},
    { timestamps: true, versionKey: false },)
export const UserModel = model(modelNameUser, schema, modelNameUser)