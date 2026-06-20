import { describe, it, expect } from "vitest";
import { api, apiJson, apiPaginated } from "../helpers/setup.js";

describe("Services", () => {
  let serviceId: number;

  describe("POST /v2/services", () => {
    it("creates a service", async () => {
      const res = await api("/v2/services", {
        method: "POST",
        body: JSON.stringify({
          name: "Integration Test Service",
          description: "Test service description",
          vat: 0.077,
          archived: false,
          local_order: 1,
          service_rates_attributes: [],
        }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number; name: string };
      expect(body).toHaveProperty("id");
      expect(body.name).toBe("Integration Test Service");
      serviceId = body.id;
    });
  });

  describe("GET /v2/services", () => {
    it("returns paginated list", async () => {
      const list = await apiPaginated("/v2/services");

      expect(list).toHaveProperty("current_page");
      expect(list).toHaveProperty("data");
      expect(Array.isArray(list.data)).toBe(true);
      expect(list.data.length).toBeGreaterThan(0);
    });
  });

  describe("GET /v2/services/:id", () => {
    it("returns a single service", async () => {
      const { status, body } = await apiJson<{ id: number }>(
        `/v2/services/${serviceId}`,
      );

      expect(status).toBe(200);
      expect(body.id).toBe(serviceId);
    });
  });

  describe("PUT /v2/services/:id", () => {
    it("updates a service", async () => {
      const { status, body } = await apiJson<{ name: string }>(
        `/v2/services/${serviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: "Updated Service",
            description: "Updated description",
            vat: 0.077,
            archived: false,
          }),
        },
      );

      expect(status).toBe(200);
      expect(body.name).toBe("Updated Service");
    });
  });

  describe("POST /v2/services/:id/duplicate", () => {
    it("duplicates a service", async () => {
      const res = await api(`/v2/services/${serviceId}/duplicate`, {
        method: "POST",
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      expect(body.id).not.toBe(serviceId);
    });
  });

  describe("DELETE /v2/services/:id", () => {
    it("deletes a service", async () => {
      const createRes = await api("/v2/services", {
        method: "POST",
        body: JSON.stringify({ name: `SvcDel ${Date.now()}`, description: "", vat: 0.077, archived: false }),
      });
      const { id } = (await createRes.json()) as { id: number };
      const res = await api(`/v2/services/${id}`, { method: "DELETE" });
      expect([200, 204]).toContain(res.status);
    });
  });
});
