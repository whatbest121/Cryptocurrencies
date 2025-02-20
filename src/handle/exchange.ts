import Elysia, { t } from "elysia";
import { UserModel } from "../momgo/model/user";

export const Exchange = <const TPath extends `/${string}`>(path: TPath) =>
    new Elysia({ prefix: path, detail: { tags: [path.substring(1)] } })
        .post("/", async ({ body: { crypto_symbol, quantity, userTo_id }, user }) => {
            const sender = await UserModel.findById(user._id);
            if (!sender) throw new Error("Sender not found");
            if (!sender.cryptocurrency_balance || sender.cryptocurrency_balance[crypto_symbol] < quantity) {
                throw new Error("Not enough quantity");
            }
            const receiver = await UserModel.findById(userTo_id);
            if (!receiver) throw new Error("Receiver not found");
            await UserModel.findByIdAndUpdate(user._id, {
                $inc: { [`cryptocurrency_balance.${crypto_symbol}`]: -quantity }
            })

            await UserModel.findByIdAndUpdate(userTo_id, {
                $inc: { [`cryptocurrency_balance.${crypto_symbol}`]: quantity }
            })
            return { message: `Transferred ${quantity} ${crypto_symbol} successfully!` };

        }, {
            body: t.Object({
                userTo_id: t.String(),
                crypto_symbol: t.String({ default: "BTC" }),
                quantity: t.Number()

            })
        })