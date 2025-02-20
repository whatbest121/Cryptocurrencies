import Elysia, { t } from "elysia";
import { UserModel } from "../momgo/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = "my_secret_key";
export const LoginHandle = <const TPath extends `/${string}`>(path: TPath) =>
    new Elysia({ prefix: path, detail: { tags: [path.substring(1)] } })
        .get("/test", () => {
            console.log("Test route hit");
            return { message: "Test route works" };
        })
        .post("/register", async ({ body: { username, password } }) => {
            console.log("Registering user...");

            const hashedPassword = await bcrypt.hash(password, 10);
            await UserModel.create({ username, hashedPassword });

            return { message: "User registered successfully" };
        },
            {
                body: t.Object({
                    username: t.String({ maxLength: 500, default: "user" }),
                    password: t.String({ maxLength: 500, default: "xxxx" }),
                })
            }
        )
        .post("/login", async ({ body: { username, password } }) => {

            const user = await UserModel.findOne({ username });
            if (!user) throw new Error("Invalid username or password!")

            const validPassword = await bcrypt.compare(password, user.hashedPassword);
            if (!validPassword) throw new Error("Invalid username or password!")

            const token = jwt.sign({ user: { username: user.username, _id: user._id } }, SECRET_KEY, { expiresIn: "1h" });
            return { message: "Login successful!", token };
        },
            {
                body: t.Object({
                    username: t.String({ maxLength: 500, default: "user" }),
                    password: t.String({ maxLength: 500, default: "xxxx" }),
                })
            });
