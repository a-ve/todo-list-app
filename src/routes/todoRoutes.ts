import express from "express";
import todoController from "../controllers/todoController";
import basicAuth from "express-basic-auth";

const todoRoutes = express.Router();

todoRoutes.use(basicAuth({
  users: { "admin": "NotSoSecurePassword" },
}));
todoRoutes.use("/", todoController);

export default todoRoutes;
