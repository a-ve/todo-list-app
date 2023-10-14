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

  test("GET /todo/:id should return a todo item", async () => {
    const todo = await (await Todo.create({
      title: "Something",
    })).get();
    const response = await request(app)
      .get("/todo/" + todo.id)
      .auth("admin", "NotSoSecurePassword");
    expect(response.status).toBe(200);
  });

  test("GET /todo/:id should return a 400 for a non existing item", async () => {
    const response = await request(app)
      .get("/todo/someid")
      .auth("admin", "NotSoSecurePassword");
    expect(response.status).toBe(400);
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

  test("POST /todo should return a 400 when the title is missing", async () => {
    const response = await request(app)
      .post("/todo")
      .auth("admin", "NotSoSecurePassword")
      .send({ "some": "thing" });

    expect(response.status).toBe(400);
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

  test("DELETE /todo should return a 400 when the item is missing", async () => {
    const response = await request(app)
      .delete("/todo/someId")
      .auth("admin", "NotSoSecurePassword")
      .send({ title: "Buy groceries" });

    expect(response.status).toBe(400);
  });
});
