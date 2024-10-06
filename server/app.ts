import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
