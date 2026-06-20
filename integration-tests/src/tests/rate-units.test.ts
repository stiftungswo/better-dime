import { describe, it, expect } from "vitest";
import { api, apiJson, apiPaginated } from "../helpers/setup.js";

describe("Rate units", () => {
  let unitId: number;

  it("POST /v2/rate_units creates a rate unit", async () => {
    const res = await api("/v2/rate_units", {
      method: "POST",
      body: JSON.stringify({ name: `RU ${Date.now()}`, billing_unit: "h", effort_unit: "h", factor: 1, is_time: true, archived: false }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    expect(body).toHaveProperty("id");
    unitId = body.id;
  });

  it("GET /v2/rate_units returns paginated list", async () => {
    const list = await apiPaginated("/v2/rate_units");
    expect(list).toHaveProperty("data");
    expect(list.data.length).toBeGreaterThan(0);
  });

  it("GET /v2/rate_units/:id returns a rate unit", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/rate_units/${unitId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(unitId);
  });

  it("PUT /v2/rate_units/:id updates a rate unit", async () => {
    const { status, body } = await apiJson<{ name: string }>(`/v2/rate_units/${unitId}`, {
      method: "PUT",
      body: JSON.stringify({ name: `RU-Upd ${Date.now()}` }),
    });
    expect(status).toBe(200);
    expect(body.name).toContain("RU-Upd");
  });

  it("DELETE /v2/rate_units/:id deletes a rate unit", async () => {
    const createRes = await api("/v2/rate_units", {
      method: "POST",
      body: JSON.stringify({ name: `RU-Del ${Date.now()}`, billing_unit: "h", effort_unit: "h", factor: 1, is_time: true, archived: false }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/rate_units/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });
});
