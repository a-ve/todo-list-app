import express from "express";
import todoRoutes from "./routes/todoRoutes";
import sequelize from "./sequelize";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  "/todo",
  todoRoutes,
);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
