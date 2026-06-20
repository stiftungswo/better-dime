import { describe, it, expect } from "vitest";
import { api, apiJson, apiArray } from "../helpers/setup.js";

describe("Locations", () => {
  let locationId: number;

  it("POST /v2/locations creates a location", async () => {
    const res = await api("/v2/locations", {
      method: "POST",
      body: JSON.stringify({ name: `Loc ${Date.now()}`, url: "locurl", order: 1, archived: false }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    expect(body).toHaveProperty("id");
    locationId = body.id;
  });

  it("GET /v2/locations returns array", async () => {
    const list = await apiArray("/v2/locations");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("GET /v2/locations/:id returns a location", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/locations/${locationId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(locationId);
  });

  it("PUT /v2/locations/:id updates a location", async () => {
    const { status, body } = await apiJson<{ name: string }>(`/v2/locations/${locationId}`, {
      method: "PUT",
      body: JSON.stringify({ name: `LocUpd ${Date.now()}`, url: "locupd", order: 1, archived: false }),
    });
    expect(status).toBe(200);
    expect(body.name).toContain("LocUpd");
  });

  it("PUT /v2/locations/:id/archive archives a location", async () => {
    const res = await api(`/v2/locations/${locationId}/archive`, {
      method: "PUT",
      body: JSON.stringify({ archived: true }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /v2/locations/:id deletes a location", async () => {
    const createRes = await api("/v2/locations", {
      method: "POST",
      body: JSON.stringify({ name: `LocDel ${Date.now()}`, url: "locdel", order: 99, archived: false }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/locations/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });
});
