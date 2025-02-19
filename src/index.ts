import { Elysia } from "elysia";
import mongoose from "mongoose";
import { MongoInitial } from "./momgo/initial";
import { LoginHandle } from "./handle/auth";
import swaggers from "./plugin/swagger";
import { FiatAndCryptocurrency } from "./handle/fiatAndCryptocurrency";

await mongoose.connect("mongodb://localhost:27017/mydb");
const app = new Elysia()

  .use(MongoInitial)
  .use(
    swaggers({
      provider: "swagger-ui",
      path: "/swagger",
    }),
  )
  .get("/", () => "Hello, Bun + Elysia! 🚀")
  .use(LoginHandle("/auth"))
  .use(FiatAndCryptocurrency("/fiatAndCryptocurrency"))



app.listen(3000, () => {
  console.log(`🦊 Elysia is running at http://localhost:3000`);
  console.log("✅ MongoDB connected successfully!");
})



