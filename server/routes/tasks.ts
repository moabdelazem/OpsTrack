import { Hono } from "hono";
import { db } from "../app";

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
  .post("/", async (c) => {
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
  .delete("/:id", async (c) => {
    const taskId = c.req.param("id");

    // Delete the task from the database
    await db.tasks.delete({
      where: {
        id: taskId,
      },
    });

    // Return a success message
    return c.json({ message: "Task deleted successfully" }, 204);
  });
