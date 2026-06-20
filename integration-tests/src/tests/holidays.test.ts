import { describe, it, expect } from "vitest";
import { api, apiJson, apiArray } from "../helpers/setup.js";

describe("Holidays", () => {
  let createdId: number;

  describe("POST /v2/holidays", () => {
    it("creates a holiday", async () => {
      const res = await api("/v2/holidays", {
        method: "POST",
        body: JSON.stringify({
          name: "Integration Test Holiday",
          date: "2026-12-25",
          duration: 1,
        }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number; name: string };
      expect(body).toHaveProperty("id");
      expect(body).toHaveProperty("name", "Integration Test Holiday");
      createdId = body.id;
    });
  });

  describe("GET /v2/holidays", () => {
    it("returns array of holidays", async () => {
      const list = await apiArray("/v2/holidays");
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("PUT /v2/holidays/:id", () => {
    it("updates a holiday", async () => {
      const { status, body } = await apiJson<{ name: string }>(
        `/v2/holidays/${createdId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: "Updated Holiday",
            date: "2026-12-25",
            duration: 1,
          }),
        },
      );

      expect(status).toBe(200);
      expect(body.name).toBe("Updated Holiday");
    });
  });

  describe("POST /v2/holidays/:id/duplicate", () => {
    it("duplicates a holiday", async () => {
      const res = await api(`/v2/holidays/${createdId}/duplicate`, {
        method: "POST",
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      expect(body.id).not.toBe(createdId);
    });
  });

  describe("DELETE /v2/holidays/:id", () => {
    it("deletes a holiday", async () => {
      const res = await api(`/v2/holidays/${createdId}`, {
        method: "DELETE",
      });

      expect([200, 204]).toContain(res.status);
    });
  });
});
