import type { Elysia } from "elysia"
import { swagger } from "elysia-api-docs"

type Path = {
    path?: `/${string}`
}
type ElysiaSwaggerConfig = Parameters<typeof swagger>[0] & Path

export const documentation: ElysiaSwaggerConfig["documentation"] = {
    info: {
        title: "test",
        version: "1.0.0",
    },
    security: [
        {
            Bearer: [""],
        },
    ],
    components: {
        securitySchemes: {
            Bearer: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Bearer token get from login.",
            },
        },
    },
}

export const swaggers =
    ({ path, provider = "swagger-ui", ...props }: ElysiaSwaggerConfig) =>
        (app: Elysia) => {
            path = path || `/${provider}`

            app.onStart(() =>
                console.log(
                    `🦊 ${provider} is running at http://localhost:3000/swagger`,
                ),
            )

            app.use(
                swagger({
                    path: path,
                    provider: provider,
                    documentation,
                    ...props,
                }),
            )
            return app
        }
export default swaggers
