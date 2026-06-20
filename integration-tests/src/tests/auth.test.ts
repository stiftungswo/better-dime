import { describe, it, expect } from "vitest";
import { signIn } from "../helpers/auth.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

describe("Authentication", () => {
  it("signs in with valid credentials and returns JWT", async () => {
    const { token, body } = await signIn();

    expect(token).toBeTruthy();
    expect(token.split(".")).toHaveLength(3); // JWT format
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("email", "zivi@example.com");
    expect(body).toHaveProperty("is_admin", true);
  });

  it("rejects invalid credentials", async () => {
    const res = await fetch(`${BASE_URL}/v2/employees/sign_in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee: { email: "zivi@example.com", password: "wrong" },
      }),
    });

    expect(res.status).toBe(401);
  });

  it("rejects unauthenticated requests", async () => {
    const res = await fetch(`${BASE_URL}/v2/employees`);
    expect(res.status).toBe(401);
  });

  it("accepts authenticated requests", async () => {
    const { token } = await signIn();
    const res = await fetch(`${BASE_URL}/v2/employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status).toBe(200);
  });
});
