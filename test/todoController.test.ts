import request from "supertest";
import express from "express";
import Todo from "../src/models/Todo";
import todoRoutes from "../src/routes/todoRoutes";
import basicAuth from "express-basic-auth";

const app = express();
app.use(express.json());
app.use("/todo", todoRoutes);
app.use(basicAuth({
  users: { "admin": "NotSoSecurePassword" },
}));

beforeAll(async () => {
  await Todo.sync({ force: true });
});

describe("Todo Controller", () => {
  test("GET /todo should be accessible", async () => {
    const response = await request(app)
      .get("/todo")
      .auth("admin", "NotSoSecurePassword");
    expect(response.status).toBe(200);
  });

  test("POST /todo should create a new todo", async () => {
    const response = await request(app)
      .post("/todo")
      .auth("admin", "NotSoSecurePassword")
      .send({ title: "Buy groceries" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Buy groceries");
    expect(response.body.completed).toBe(false);
  });

  test("PATCH /todo should update a todo", async () => {
    const todo = await (await Todo.create({
      title: "Something",
    })).get();
    const response = await request(app)
      .patch("/todo/" + todo.id)
      .auth("admin", "NotSoSecurePassword")
      .send({ title: "Buy groceries" });

    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Buy groceries");
    expect(response.body.completed).toBe(false);
  });

  test("DELETE /todo should delete a todo", async () => {
    const todo = await (await Todo.create({
      title: "Something",
    })).get();
    const response = await request(app)
      .delete("/todo/" + todo.id)
      .auth("admin", "NotSoSecurePassword")
      .send({ title: "Buy groceries" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe("Item deleted");
  });
});
