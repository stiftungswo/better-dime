import { describe, it, expect } from "vitest";
import { apiJson } from "../helpers/setup.js";
import type { PaginatedResponse } from "../helpers/setup.js";

describe("Pagination", () => {
  it("returns pagination envelope with expected fields", async () => {
    const { status, body } =
      await apiJson<PaginatedResponse>("/v2/employees");

    expect(status).toBe(200);
    expect(body).toHaveProperty("current_page");
    expect(body).toHaveProperty("total");
    expect(body).toHaveProperty("per_page");
    expect(body).toHaveProperty("data");
    expect(typeof body.current_page).toBe("number");
    expect(typeof body.total).toBe("number");
    expect(typeof body.per_page).toBe("number");
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("respects page and pageSize params", async () => {
    const { body } = await apiJson<PaginatedResponse>(
      "/v2/employees?page=1&pageSize=1",
    );

    expect(body.current_page).toBe(1);
    expect(body.per_page).toBe(1);
    expect(body.data.length).toBeLessThanOrEqual(1);
  });

  it("supports ransack search params", async () => {
    const { status } = await apiJson(
      "/v2/employees?q[first_name_cont]=Zivi",
    );

    expect(status).toBe(200);
  });
});
