import { Schema, model } from "mongoose"

export const modelNameCryptocurrencies = "cryptocurrencies"
const schema = new Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    current_price: { type: Number, required: true, unique: true },
},
    { timestamps: true, versionKey: false }
)

export const CryptocurrenciesModel = model(modelNameCryptocurrencies, schema, modelNameCryptocurrencies)