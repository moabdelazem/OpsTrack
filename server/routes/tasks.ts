import { Hono } from "hono";
import { db } from "../app";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

// Create Zod Schema for the Task model
const TaskSchema = z.object({
  title: z.string(),
});

const updateTaskSchema = z.object({
  title: z.string(),
  completed: z.boolean(),
});

// Create a new Hono instance
export const tasksRoutes = new Hono()
  .get("/", async (c) => {
    // Query all tasks from the database
    const allTasks = await db.tasks.findMany();

    // Return the tasks as JSON
    return c.json({ tasks: allTasks }, 200);
  })
  .get("/total", async (c) => {
    // Query the total number of tasks from the database
    const totalTasks = await db.tasks.count();

    // Return the total number of tasks as JSON
    return c.json({ total: totalTasks }, 200);
  })
  .get("/dashboard-stats", async (c) => {
    // Query the total number of tasks from the database
    const totalTasks = await db.tasks.count();

    // Query the total number of completed tasks from the database
    const completedTasks = await db.tasks.count({
      where: {
        completed: true,
      },
    });

    // Calculate the percentage of completed tasks
    const completedPercentage = Math.round((completedTasks / totalTasks) * 100);

    // Return the dashboard stats as JSON
    return c.json(
      {
        stats: {
          total: totalTasks,
          completed: completedTasks,
          completedPercentage,
        },
      },
      200
    );
  })
  .post("/", zValidator("json", TaskSchema), async (c) => {
    // Parse the request body as JSON
    const { title } = await c.req.json();

    // Create a new task in the database
    const newTask = await db.tasks.create({
      data: {
        title,
      },
    });

    // Return the new task as JSON
    return c.json({ task: newTask }, 201);
  })
  .put("/:id/check", async (c) => {
    const taskId = c.req.param("id");
    const taskStatus = await db.tasks.findUnique({
      where: {
        id: taskId,
      },
      select: {
        completed: true,
      },
    });

    // Update the task in the database
    const updatedTask = await db.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        completed: !taskStatus,
      },
    });

    // Return the updated task as JSON
    return c.json({ task: updatedTask }, 200);
  })
  .delete("/:id", zValidator("json", TaskSchema), async (c) => {
    const taskId = c.req.param("id");

    // Delete the task from the database
    await db.tasks.delete({
      where: {
        id: taskId,
      },
    });

    // Return a success message
    return c.json({ message: "Task deleted successfully" }, 204);
  })
  .put("/:id", zValidator("json", updateTaskSchema), async (c) => {
    const taskId = c.req.param("id");
    const { title, completed } = await c.req.json();

    // Update the task in the database
    const updatedTask = await db.tasks.update({
      where: {
        id: taskId,
      },
      data: {
        title,
        completed,
      },
    });

    // Return the updated task as JSON
    return c.json({ task: updatedTask }, 200);
  });
