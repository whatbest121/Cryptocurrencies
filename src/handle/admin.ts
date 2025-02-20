import Elysia, { t } from "elysia";
import { UserModel } from "../momgo/model/user";
import { CryptocurrenciesModel } from "../momgo/model/Cryptocurrencies";
import { PaymentsModel } from "../momgo/model/Payments";
import { OrderModel } from "../momgo/model/Orders";


export const Admin = <const TPath extends `/${string}`>(path: TPath) =>
    new Elysia({ prefix: path, detail: { tags: [path.substring(1)] } })
        .get("/profile", async () => {
            const result = await UserModel.find()
            return result
        })
        .get("/crypto", async () => {
            const result = await CryptocurrenciesModel.find()
            return result
        })
        .get("/payments", async () => {
            const result = await PaymentsModel.find().populate({ path: "user_id", select: "username fiat_balance" })
            return result
        })
        .get("/order", async () => {
            const result = await OrderModel.find().populate("crypto_id").populate({ path: "user_id", select: "username" })
            return result
        })

        .post("/cryptocurrency", async ({ user: { _id }, body: { BTC, DOGE, ETH, XRP } }) => {
            const user = await UserModel.findById(_id)
            if (!user) throw new Error("User not found")
            const updateCryptocurrency = {
                BTC: (user.cryptocurrency_balance?.BTC ?? 0) + BTC,
                DOGE: (user.cryptocurrency_balance?.DOGE ?? 0) + DOGE,
                ETH: (user.cryptocurrency_balance?.ETH ?? 0) + ETH,
                XRP: (user.cryptocurrency_balance?.XRP ?? 0) + XRP,
            };
            const result = await UserModel.findByIdAndUpdate(_id, { cryptocurrency_balance: updateCryptocurrency }, { new: true })
            return { message: "cryptocurrency_balance updated successfully", result };

        }, {
            body: t.Object({
                BTC: t.Number({ default: 0 }),
                ETH: t.Number({ default: 0 }),
                XRP: t.Number({ default: 0 }),
                DOGE: t.Number({ default: 0 })
            })
        })

        .put("/update-payment", async ({ body: { payment_id, status } }) => {
            if (!["pending", "completed", "failed"].includes(status)) {
                throw new Error("Invalid status");
            }

            const payment = await PaymentsModel.findById(payment_id);
            if (!payment) throw new Error("Payment not found");

            if (payment.status === "completed") {
                throw new Error("Payment is already completed");
            }

            const updatedPayment = await PaymentsModel.findByIdAndUpdate(
                payment_id,
                { status },
                { new: true }
            );

            if (status === "completed") {
                await UserModel.findByIdAndUpdate(payment.user_id, {
                    $inc: { fiat_balance: payment.fiat_amount },
                });
            }

            return { message: `Payment status updated to ${status}`, updatedPayment };
        }, {
            body: t.Object({
                payment_id: t.String(),
                status: t.String({ default: "completed" }),
            }),
        });
