import { describe, it, expect } from "vitest";
import { api, apiJson, apiArray } from "../helpers/setup.js";

describe("Project categories", () => {
  let catId: number;

  it("POST /v2/project_categories creates a category", async () => {
    const res = await api("/v2/project_categories", {
      method: "POST",
      body: JSON.stringify({ project_category: { name: `ProjCat ${Date.now()}`, archived: false } }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    expect(body).toHaveProperty("id");
    catId = body.id;
  });

  it("GET /v2/project_categories returns array", async () => {
    const list = await apiArray("/v2/project_categories");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("GET /v2/project_categories/:id returns a category", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/project_categories/${catId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(catId);
  });

  it("PUT /v2/project_categories/:id updates a category", async () => {
    const { status, body } = await apiJson<{ name: string }>(`/v2/project_categories/${catId}`, {
      method: "PUT",
      body: JSON.stringify({ project_category: { name: `ProjCatUpd ${Date.now()}` } }),
    });
    expect(status).toBe(200);
    expect(body.name).toContain("ProjCatUpd");
  });

  it("PUT /v2/project_categories/:id/archive archives a category", async () => {
    const res = await api(`/v2/project_categories/${catId}/archive`, {
      method: "PUT",
      body: JSON.stringify({ archived: true }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /v2/project_categories/:id deletes a category", async () => {
    const createRes = await api("/v2/project_categories", {
      method: "POST",
      body: JSON.stringify({ project_category: { name: `ProjCatDel ${Date.now()}`, archived: false } }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/project_categories/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });
});
