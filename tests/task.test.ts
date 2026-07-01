import request from "supertest";
import app from "../src/app";
import User from "../src/models/User";

const aliceEmail = "jest-alice@example.com";
const bobEmail = "jest-bob@example.com";
const password = "secret123";

let tokenA: string;
let tokenB: string;

beforeAll(async () => {
  const regA = await request(app).post("/api/auth/register").send({ email: aliceEmail, password });
  tokenA = regA.body.token;

  const regB = await request(app).post("/api/auth/register").send({ email: bobEmail, password });
  tokenB = regB.body.token;
});

afterAll(async () => {
  await User.destroy({ where: { email: [aliceEmail, bobEmail] } });
});

describe("task CRUD", () => {
  it("blocks unauthenticated requests", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(401);
  });

  it("rejects a task without a title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ description: "no title" });

    expect(res.status).toBe(400);
  });

  it("creates a task for the authenticated user", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Alice task" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Alice task");
    expect(res.body.status).toBe("pending");
  });

  it("only lists the authenticated user's tasks", async () => {
    const resA = await request(app).get("/api/tasks").set("Authorization", `Bearer ${tokenA}`);
    const resB = await request(app).get("/api/tasks").set("Authorization", `Bearer ${tokenB}`);

    expect(resA.body.length).toBe(1);
    expect(resB.body.length).toBe(0);
  });

  it("prevents one user from reading or modifying another user's task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Private task" });
    const taskId = created.body.id;

    const getRes = await request(app).get(`/api/tasks/${taskId}`).set("Authorization", `Bearer ${tokenB}`);
    expect(getRes.status).toBe(404);

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "hacked" });
    expect(updateRes.status).toBe(404);

    const deleteRes = await request(app).delete(`/api/tasks/${taskId}`).set("Authorization", `Bearer ${tokenB}`);
    expect(deleteRes.status).toBe(404);
  });

  it("updates and deletes the owner's own task", async () => {
    const created = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "To finish" });
    const taskId = created.body.id;

    const updateRes = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ status: "completed" });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.status).toBe("completed");

    const deleteRes = await request(app).delete(`/api/tasks/${taskId}`).set("Authorization", `Bearer ${tokenA}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/tasks/${taskId}`).set("Authorization", `Bearer ${tokenA}`);
    expect(getRes.status).toBe(404);
  });
});
