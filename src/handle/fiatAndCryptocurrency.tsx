import Elysia, { t } from "elysia";
import { UserModel } from "../momgo/model/user";


export const FiatAndCryptocurrency = <const TPath extends `/${string}`>(path: TPath) =>
    new Elysia({ prefix: path, detail: { tags: [path.substring(1)] } })
        .post("/balance", async ({ body: { USD, _id } }) => {
            const user = await UserModel.findById(_id)
            if (!user) throw new Error("User not found")
            const updatedFiatBalance = user.fiat_balance + USD;
            const result = await UserModel.findByIdAndUpdate(_id, { fiat_balance: updatedFiatBalance }, { new: true })
            return { message: "Balance updated successfully", result };

        }, {
            body: t.Object({
                _id: t.String({ maxLength: 500, default: "_Id" }),
                USD: t.Number({ default: 0 })
            })
        })
        .post("/cryptocurrency", async ({ body: { BTC, DOGE, ETH, XRP, _id } }) => {
            const user = await UserModel.findById(_id)
            if (!user) throw new Error("User not found")
            const updateCryptocurrency = {
                BTC: user.cryptocurrency_balance?.BTC ?? 0 + BTC,
                DOGE: user.cryptocurrency_balance?.DOGE ?? 0 + DOGE,
                ETH: user.cryptocurrency_balance?.ETH ?? 0 + ETH,
                XRP: user.cryptocurrency_balance?.XRP ?? 0 + XRP,

            }
            const result = await UserModel.findByIdAndUpdate(_id, { cryptocurrency_balance: updateCryptocurrency }, { new: true })
            return { message: "cryptocurrency_balance updated successfully", result };

        }, {
            body: t.Object({
                _id: t.String({ maxLength: 500, default: "_Id" }),
                BTC: t.Number({ default: 0 }),
                ETH: t.Number({ default: 0 }),
                XRP: t.Number({ default: 0 }),
                DOGE: t.Number({ default: 0 })
            })
        })