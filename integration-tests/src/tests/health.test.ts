import { describe, it, expect } from "vitest";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

describe("Health check", () => {
  it("GET /health returns OK", async () => {
    const res = await fetch(`${BASE_URL}/health`, { redirect: "follow" });
    expect(res.ok).toBe(true);
  });
});
