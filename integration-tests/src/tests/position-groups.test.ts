import { describe, it, expect } from "vitest";
import { api } from "../helpers/setup.js";

describe("Position groups", () => {
  it("POST /v2/position_groups creates a position group", async () => {
    const res = await api("/v2/position_groups", {
      method: "POST",
      body: JSON.stringify({ name: `PG ${Date.now()}` }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number; name: string };
    expect(body).toHaveProperty("id");
  });
});
