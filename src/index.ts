import { Elysia } from "elysia";
import mongoose from "mongoose";
import { MongoInitial } from "./momgo/initial";
import { LoginHandle } from "./handle/auth";
import swaggers from "./plugin/swagger";
import { Admin } from "./handle/admin";
import { AuthMiddleware } from "./middlewares/auth";
import { Order } from "./handle/order";
import { Payment } from "./handle/pay";
import { Exchange } from "./handle/exchange";

const app = new Elysia()

  .use(MongoInitial)
  .use(
    swaggers({
      provider: "swagger-ui",
      path: "/swagger",
    }),
  )
  .get("/", () => {
    return `Hello, Bun + Elysia! 🚀`
  })
  .group("/admin", (app) =>
    app
      .use(Admin("/admin"))
  )
  .group("/user", (app) =>
    app
      .use(LoginHandle("/auth"))
      .use(AuthMiddleware)
      .use(Order("/order"))
      .use(Payment("/pay"))
      .use(Exchange("/exchange"))

  )
app.listen(3000, () => {
  console.log(`🦊 Elysia is running at http://localhost:3000`);
})



