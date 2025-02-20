import { model, Schema } from "mongoose";
import { modelNameUser } from "./user";

const modelNamePayments = "paymentsModel"
const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: modelNameUser, required: true },
    fiat_amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], required: true },
}, { timestamps: true, versionKey: false });

export const PaymentsModel = model(modelNamePayments, schema, modelNamePayments);
