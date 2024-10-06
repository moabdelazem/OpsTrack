import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { tasksRoutes } from "./routes/tasks";

// Create a new Hono instance
const app = new Hono();

// Create a new Prisma client
export const db = new PrismaClient();

app.use(logger());

// Set the base path for the API
app.basePath("/api").route("/tasks", tasksRoutes);

export default app;
