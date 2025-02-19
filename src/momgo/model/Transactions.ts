import { model, Schema } from "mongoose";
import { modelNameCryptocurrencies } from "./Cryptocurrencies";
import { modelNameUser } from "./user";
export const modelNameTransactions = "transactions"
const schema = new Schema({
    from_user_id: { type: Schema.Types.ObjectId, ref: modelNameUser, require: true },
    to_user_id: { type: Schema.Types.ObjectId, ref: modelNameUser, require: true },
    crypto_id: { type: Schema.Types.ObjectId, ref: modelNameCryptocurrencies, require: true },
    amount: { type: Number, require: true },
    transaction_type: { type: String, enum: ["internal", "external"], require: true },
    status: { type: String, enum: ["completed", "failed"], require: true },
}, { timestamps: true, versionKey: false })

export const TransactionsModel = model(modelNameTransactions, schema, modelNameTransactions)