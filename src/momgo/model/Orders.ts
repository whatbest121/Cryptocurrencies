import { Schema, model } from "mongoose"
import { modelNameUser } from "./user"
import { modelNameCryptocurrencies } from "./Cryptocurrencies"
export const modelNameOrder = "order"

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: modelNameUser, required: true, },
    crypto_id: { type: Schema.Types.ObjectId, ref: modelNameCryptocurrencies, required: true, },
    order_type: { type: String, enum: ["buy", "sell"], required: true, },
    quantity: { type: Number, required: true, },
    price: { type: Number, required: true, },
    status: { type: String, enum: ["pending", "completed", "canceled"], required: true, },
},
    { timestamps: true, versionKey: false })

export const OrderModel = model(modelNameOrder, schema, modelNameOrder)