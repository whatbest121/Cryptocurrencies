import { Elysia, HTTPHeaders } from "elysia";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = "my_secret_key"; // ควรใช้ .env

interface UserPayload extends JwtPayload {
  user: { id: string; username: string };
}

export const AuthMiddleware = new Elysia()
  .derive(({ headers }: { headers: HTTPHeaders | undefined }) => {
    const token = headers?.authorization?.split(" ")[1]; // เช็คว่ามี token หรือไม่
    if (!token) throw new Error("Unauthorized");

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
      if (!decoded.user) throw new Error("Invalid Token Structure");

      return { user: decoded.user };
    } catch (error) {
      throw new Error("Invalid Token");
    }
  })
  .onBeforeHandle(({ store }) => {
    if (!store.user) throw new Error("Unauthorized"); // หากไม่มี user ใน store จะเกิด error
  });
