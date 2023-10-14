import express, { Request, Response } from "express";
import Todo from "../models/Todo";
import { where } from "sequelize";

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await Todo.findOne({
    where: {
      id: id,
    },
  });

  if (todo === null) {
    return res.status(400).json({ error: "Item not found" });
  }
  return res.status(200).json(todo);
});

router.post("/", async (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTodo = await Todo.create({ title });
  res.status(201).json(newTodo);
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = await Todo.findOne({
    where: {
      id: id,
    },
  });
  if (todo === null) {
    return res.status(400).json({ error: "Item not found" });
  }
  await todo.destroy();
  return res.status(200).json({ success: "Item deleted" });
});

router.patch("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;
  const update = await Todo.update({ title: title }, {
    where: { id: id },
  });
  const todo = await Todo.findOne({
    where: {
      id: id,
    },
  });
  if (update[0] > 0) {
    return res.status(202).json(todo);
  } else return res.status(200).json(todo);
});
export default router;
