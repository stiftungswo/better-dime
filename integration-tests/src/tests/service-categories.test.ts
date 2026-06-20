import { describe, it, expect } from "vitest";
import { api, apiJson, apiArray } from "../helpers/setup.js";

describe("Service categories", () => {
  let catId: number;

  it("POST /v2/service_categories creates a category", async () => {
    const num = Date.now() % 90 + 1;
    const res = await api("/v2/service_categories", {
      method: "POST",
      body: JSON.stringify({ name: `SvcCat ${Date.now()}`, french_name: `CatSvc ${Date.now()}`, number: num }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    expect(body).toHaveProperty("id");
    catId = body.id;
  });

  it("GET /v2/service_categories returns array", async () => {
    const list = await apiArray("/v2/service_categories");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("GET /v2/service_categories/:id returns a category", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/service_categories/${catId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(catId);
  });

  it("PUT /v2/service_categories/:id updates a category", async () => {
    const { status, body } = await apiJson<{ name: string }>(`/v2/service_categories/${catId}`, {
      method: "PUT",
      body: JSON.stringify({ name: `SvcCatUpd ${Date.now()}` }),
    });
    expect(status).toBe(200);
    expect(body.name).toContain("SvcCatUpd");
  });

  it("DELETE /v2/service_categories/:id deletes a category", async () => {
    const num2 = (Date.now() % 90) + 2;
    const createRes = await api("/v2/service_categories", {
      method: "POST",
      body: JSON.stringify({ name: `SvcCatDel ${Date.now()}`, french_name: `Del ${Date.now()}`, number: num2 }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/service_categories/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });
});
