import request from "supertest";
import app from "../src/app";
import User from "../src/models/User";

const email = "jest-auth@example.com";
const password = "secret123";

afterAll(async () => {
  await User.destroy({ where: { email } });
});

describe("POST /api/auth/register", () => {
  it("rejects an invalid email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "not-an-email", password });

    expect(res.status).toBe(400);
  });

  it("rejects a short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, password: "short" });

    expect(res.status).toBe(400);
  });

  it("creates a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({ email, password });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(email);
    expect(res.body.password).toBeUndefined();
    expect(typeof res.body.token).toBe("string");
  });

  it("rejects a duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send({ email, password });

    expect(res.status).toBe(409);
  });
});

describe("POST /api/auth/login", () => {
  it("rejects a wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrongpass" });

    expect(res.status).toBe(401);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({ email, password });

    expect(res.status).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });
});
