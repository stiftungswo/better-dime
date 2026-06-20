import { describe, it, expect } from "vitest";
import { api, apiJson, apiArray, apiPaginated } from "../helpers/setup.js";

describe("Reference data endpoints", () => {
  describe("Rate groups", () => {
    it("GET /v2/rate_groups returns array", async () => {
      const list = await apiArray("/v2/rate_groups");
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("Cost groups", () => {
    it("GET /v2/costgroups returns array", async () => {
      const list = await apiArray("/v2/costgroups");
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("Employee groups (full CRUD)", () => {
    let groupId: number;

    it("POST /v2/employee_groups creates a group", async () => {
      const res = await api("/v2/employee_groups", {
        method: "POST",
        body: JSON.stringify({ employee_group: { name: `EG ${Date.now()}` } }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      groupId = body.id;
    });

    it("GET /v2/employee_groups returns array", async () => {
      const list = await apiArray<{ id: number }>("/v2/employee_groups");
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
    });

    it("GET /v2/employee_groups/:id returns a single group", async () => {
      const { status, body } = await apiJson<{ id: number }>(`/v2/employee_groups/${groupId}`);
      expect(status).toBe(200);
      expect(body.id).toBe(groupId);
    });

    it("PUT /v2/employee_groups/:id updates a group", async () => {
      const { status, body } = await apiJson<{ name: string }>(`/v2/employee_groups/${groupId}`, {
        method: "PUT",
        body: JSON.stringify({ employee_group: { name: `EG-Upd ${Date.now()}` } }),
      });
      expect(status).toBe(200);
      expect(body.name).toContain("EG-Upd");
    });

    it("DELETE /v2/employee_groups/:id deletes a group", async () => {
      const createRes = await api("/v2/employee_groups", {
        method: "POST",
        body: JSON.stringify({ employee_group: { name: `EG-Del ${Date.now()}` } }),
      });
      const { id } = (await createRes.json()) as { id: number };
      const res = await api(`/v2/employee_groups/${id}`, { method: "DELETE" });
      expect([200, 204]).toContain(res.status);
    });
  });

  describe("Customer tags (full CRUD)", () => {
    let tagId: number;

    it("POST /v2/customer_tags creates a tag", async () => {
      const res = await api("/v2/customer_tags", {
        method: "POST",
        body: JSON.stringify({ customer_tag: { name: `Tag-${Date.now()}`, archived: false } }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      tagId = body.id;
    });

    it("GET /v2/customer_tags returns array", async () => {
      const list = await apiArray("/v2/customer_tags");
      expect(Array.isArray(list)).toBe(true);
      expect(list.length).toBeGreaterThan(0);
    });

    it("GET /v2/customer_tags/:id returns a tag", async () => {
      const { status } = await apiJson(`/v2/customer_tags/${tagId}`);
      expect(status).toBe(200);
    });

    it("PUT /v2/customer_tags/:id updates a tag", async () => {
      const { status } = await apiJson(`/v2/customer_tags/${tagId}`, {
        method: "PUT",
        body: JSON.stringify({ customer_tag: { name: `TagUpd-${Date.now()}` } }),
      });
      expect(status).toBe(200);
    });

    it("PUT /v2/customer_tags/:id/archive archives a tag", async () => {
      const res = await api(`/v2/customer_tags/${tagId}/archive`, {
        method: "PUT",
        body: JSON.stringify({ archived: true }),
      });
      expect(res.status).toBe(200);
    });

    it("DELETE /v2/customer_tags/:id deletes a tag", async () => {
      const createRes = await api("/v2/customer_tags", {
        method: "POST",
        body: JSON.stringify({ customer_tag: { name: `TagDel-${Date.now()}`, archived: false } }),
      });
      const { id } = (await createRes.json()) as { id: number };
      const res = await api(`/v2/customer_tags/${id}`, { method: "DELETE" });
      expect([200, 204]).toContain(res.status);
    });
  });

  describe("Global settings", () => {
    it("GET /v2/global_settings returns settings", async () => {
      const res = await api("/v2/global_settings");
      expect(res.status).toBe(200);
    });

    it("PUT /v2/global_settings updates settings", async () => {
      const res = await api("/v2/global_settings", {
        method: "PUT",
        body: JSON.stringify({ sender_web: "https://updated.example.com" }),
      });
      expect(res.status).toBe(200);
    });
  });
});
