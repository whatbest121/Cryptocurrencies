import Elysia, { t } from "elysia";
import { CryptocurrenciesModel } from "../momgo/model/Cryptocurrencies";


const SECRET_KEY = "my_secret_key";
export const Cryptocurrencies = <const TPath extends `/${string}`>(path: TPath) =>
    new Elysia({ prefix: path, detail: { tags: [path.substring(1)] } })

        .get("/", async () => {
            const result = await CryptocurrenciesModel.find()
            return result
        })
        .post("/addCryptocurrencies", async ({ body: { current_price, name, symbol } }) => {
            const result = await CryptocurrenciesModel.create({
                symbol,
                name,
                current_price,
            })
            return { message: `cryptocurrency add ${name}(${symbol}) : ${current_price}`, result };
        }, {
            body: t.Object({
                symbol: t.String({ default: "", unique: true }),
                name: t.String({ default: "", unique: true }),
                current_price: t.Number({ default: 0, unique: true }),
            })
        })
