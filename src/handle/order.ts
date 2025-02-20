import Elysia, { t } from "elysia";
import { UserModel } from "../momgo/model/user";
import { OrderModel } from "../momgo/model/Orders";
import { CryptocurrenciesModel } from "../momgo/model/Cryptocurrencies";


export const Order = <const TPath extends `/${string}`>(path: TPath) =>
    new Elysia({ prefix: path, detail: { tags: [path.substring(1)] } })
        .get("/", async ({ user }) => {
            const result = await OrderModel.findById(user.id).populate("crypto_id").populate({ path: "user_id", select: "username" })
            return result
        })
        .post("/sell", async ({ body: { crypto_id, quantity }, user }) => {
            const crypto = await CryptocurrenciesModel.findById(crypto_id);
            if (!crypto) throw new Error("Cryptocurrency not found!");

            const checkUserCrypto = await UserModel.findById(user._id);
            if (!checkUserCrypto) throw new Error("User not found!");

            const coin = checkUserCrypto.cryptocurrency_balance[crypto.symbol];
            if (coin < quantity) throw new Error(`There is not enough ${crypto.symbol} coins.`);

            // ลดเหรียญจากผู้ขาย
            await UserModel.findByIdAndUpdate(user._id, {
                $inc: {
                    [`cryptocurrency_balance.${crypto.symbol}`]: -quantity
                }
            });

            // ตรวจสอบคำสั่งซื้อ (buy order) ที่ตรงกับ crypto_id และปริมาณเหรียญที่ต้องการ
            const buyOrder = await OrderModel.findOne({
                crypto_id,
                order_type: "buy",
                status: "pending", // คำสั่งซื้อที่ยังไม่ดำเนินการ
                quantity: { $gte: quantity }, // ตรวจสอบว่า order มีปริมาณเหรียญเพียงพอ
            });

            let newOrder;

            if (buyOrder) {
                // ถ้ามีคำสั่งซื้อที่ตรงกัน
                // ลดจำนวนเหรียญในคำสั่งซื้อที่ตรงกัน
                await OrderModel.findByIdAndUpdate(buyOrder._id, {
                    $inc: { quantity: -quantity },
                });

                // สร้างคำสั่งขายใหม่ที่เหลือ
                const remainingQuantity = buyOrder.quantity - quantity;
                if (remainingQuantity > 0) {
                    newOrder = await OrderModel.create({
                        user_id: user._id,
                        crypto_id: crypto_id,
                        order_type: "sell",
                        quantity: remainingQuantity, // ปริมาณที่เหลือ
                        status: "pending",
                        price: crypto.current_price,
                    });
                }

                return { message: "Sell and buy orders matched successfully", order: buyOrder };
            } else {
                // ถ้าไม่มีคำสั่งซื้อที่ตรงกัน ให้สร้างคำสั่งขายใหม่
                newOrder = await OrderModel.create({
                    user_id: user._id,
                    crypto_id: crypto_id,
                    order_type: "sell",
                    quantity: quantity,
                    status: "pending",
                    price: crypto.current_price,
                });

                return { message: "No matching buy order, sell order created", order: newOrder };
            }
        },
            {
                body: t.Object({
                    crypto_id: t.String(),
                    quantity: t.Number(),
                }),
            })


        .post("/buy", async ({ body: { crypto_id, quantity }, user }) => {
            const crypto = await CryptocurrenciesModel.findById(crypto_id);
            if (!crypto) throw new Error("Cryptocurrency not found!");

            const checkUserFiat = await UserModel.findById(user._id);
            if (!checkUserFiat) throw new Error("User not found!");

            const money = checkUserFiat.fiat_balance;
            if (money < crypto.current_price * quantity) throw new Error("Insufficient funds!");

            // ตรวจสอบคำสั่งขาย (sell order) ที่ตรงกับ crypto_id และปริมาณเหรียญที่ต้องการ
            const sellOrder = await OrderModel.findOne({
                crypto_id,
                order_type: "sell",
                status: "pending", // คำสั่งขายที่ยังไม่ดำเนินการ
                quantity: { $gte: quantity }, // ตรวจสอบว่า order มีปริมาณเหรียญเพียงพอ
            });

            let newOrder;

            if (sellOrder) {
                // ถ้ามีคำสั่งขายที่ตรงกัน
                // ลดจำนวนเงินในบัญชีผู้ซื้อ
                await UserModel.findByIdAndUpdate(user._id, {
                    $inc: { fiat_balance: -(crypto.current_price * quantity) }
                });

                // ลดจำนวนเหรียญในคำสั่งขาย
                await OrderModel.findByIdAndUpdate(sellOrder._id, {
                    $inc: { quantity: -quantity },
                    $set: { status: "completed" }, // เปลี่ยนสถานะคำสั่งขายเป็น "completed"
                });

                // เพิ่มจำนวนเหรียญในบัญชีผู้ซื้อ
                const buyer = await UserModel.findById(user._id);
                if (!buyer) throw new Error("Buyer not found!");

                await UserModel.findByIdAndUpdate(user._id, {
                    $inc: { [`cryptocurrency_balance.${crypto.symbol}`]: quantity }
                });

                // สร้างคำสั่งซื้อใหม่ (ซื้อเหรียญ)
                newOrder = await OrderModel.create({
                    user_id: user._id,
                    crypto_id: crypto_id,
                    order_type: "buy",
                    quantity: quantity,
                    status: "completed",
                    price: crypto.current_price,
                });

                return { message: "Buy order completed, cryptocurrency transferred", order: newOrder };
            } else {
                // ถ้าไม่มีคำสั่งขายที่ตรงกัน ให้สร้างคำสั่งซื้อใหม่
                newOrder = await OrderModel.create({
                    user_id: user._id,
                    crypto_id: crypto_id,
                    order_type: "buy",
                    quantity: quantity,
                    status: "pending", // สถานะรอการจับคู่
                    price: crypto.current_price,
                });

                return { message: "No matching sell order, buy order created", order: newOrder };
            }
        },
            {
                body: t.Object({
                    crypto_id: t.String(),
                    quantity: t.Number(),
                }),
            })
