import Elysia, { t } from "elysia";
import { PaymentsModel } from "../momgo/model/Payments";

export const Payment = <const TPath extends `/${string}`>(path: TPath) =>
    new Elysia({ prefix: path, detail: { tags: [path.substring(1)] } })
        .get("/", async ({ user }) => {
            const result = await PaymentsModel.findById(user._id).populate({ path: "user_id", select: "username fiat_balance" })
            return result
        })
        .post("/pay", async ({ body: { fiat_amount }, user }) => {
            if (fiat_amount <= 0) throw new Error("Amount must be greater than zero");

            const payment = await PaymentsModel.create({
                user_id: user._id,
                fiat_amount,
                status: "pending",
            });

            return { message: "Payment initiated", payment };
        }, {
            body: t.Object({
                fiat_amount: t.Number(),
            }),
        });
