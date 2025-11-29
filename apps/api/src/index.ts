import { Elysia } from "elysia";

const app = new Elysia({
  name: 'root',
})
  .get("/health", () => "Health!")
  .listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
