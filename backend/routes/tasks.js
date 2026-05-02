import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/tasks — Get all tasks for logged-in user
router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const tasks = await db
      .collection("tasks")
      .find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// POST /api/tasks — Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Task title is required." });
    }

    const db = getDb();
    const newTask = {
      title,
      description: description || "",
      completed: false,
      userId: req.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(newTask);
    newTask._id = result.insertedId;

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// PUT /api/tasks/:id — Update a task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const db = getDb();
    const updateFields = { updatedAt: new Date() };

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (completed !== undefined) updateFields.completed = completed;

    const result = await db.collection("tasks").findOneAndUpdate(
      { _id: new ObjectId(id), userId: req.userId },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// DELETE /api/tasks/:id — Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID." });
    }

    const db = getDb();
    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(id),
      userId: req.userId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
