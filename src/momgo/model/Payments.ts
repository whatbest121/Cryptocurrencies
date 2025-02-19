import { model, Schema } from "mongoose";
import { modelNameUser } from "./user";
import { modelNameCryptocurrencies } from "./Cryptocurrencies";


const modelNamePayments = "paymentsModel"
const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: modelNameUser, require: true },
    fiat_amount: { type: Number, require: true },
    crypto_id: { type: Schema.Types.ObjectId, ref: modelNameCryptocurrencies, required: true, },
    crypto_amount: { type: Number, require: true },
    status: { type: String, enum: ["pending", "completed", "failed"], require: true },

}, { timestamps: true, versionKey: false })

export const PaymentsModel = model(modelNamePayments, schema, modelNamePayments)