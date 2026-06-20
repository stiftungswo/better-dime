import { describe, it, expect } from "vitest";
import { api, apiJson, apiPaginated, apiArray } from "../helpers/setup.js";

describe("Projects", () => {
  let projectId: number;

  describe("POST /v2/projects", () => {
    it("creates a project", async () => {
      const employees = await apiPaginated<{ id: number }>("/v2/employees");
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      expect(rateGroups.length).toBeGreaterThan(0);

      const personRes = await api("/v2/people", {
        method: "POST",
        body: JSON.stringify({
          person: {
            type: "Person",
            first_name: "ProjectTest",
            last_name: "Customer",
            email: `proj-cust-${Date.now()}@example.com`,
            rate_group_id: rateGroups[0].id,
            hidden: false,
            comment: "",
          },
          tags: [],
          phone_numbers: [],
          addresses: [
            { city: "Teststadt", country: "Schweiz", zip: 8000, street: "Projektstr 1" },
          ],
        }),
      });
      expect(personRes.status).toBe(200);
      const person = (await personRes.json()) as { id: number; addresses: { id: number }[] };

      const res = await api("/v2/projects", {
        method: "POST",
        body: JSON.stringify({
          accountant_id: employees.data[0].id,
          address_id: person.addresses[0].id,
          customer_id: person.id,
          description: "Integration test project",
          name: `IntegrationProject ${Date.now()}`,
          rate_group_id: rateGroups[0].id,
          location_id: null,
          deadline: null,
          fixed_price: null,
          archived: false,
          chargeable: false,
          vacation_project: false,
          positions: [],
          costgroup_distributions: [],
          category_distributions: [],
          position_groupings: [],
        }),
      });

      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      expect(body).toHaveProperty("id");
      projectId = body.id;
    });
  });

  describe("GET /v2/projects", () => {
    it("returns paginated list", async () => {
      const list = await apiPaginated("/v2/projects");
      expect(list).toHaveProperty("current_page");
      expect(list).toHaveProperty("total");
      expect(list).toHaveProperty("data");
      expect(Array.isArray(list.data)).toBe(true);
    });
  });

  describe("GET /v2/projects/:id", () => {
    it("returns a single project", async () => {
      const { status, body } = await apiJson<{ id: number }>(`/v2/projects/${projectId}`);
      expect(status).toBe(200);
      expect(body.id).toBe(projectId);
    });
  });

  describe("PUT /v2/projects/:id", () => {
    it("updates a project", async () => {
      const { status, body } = await apiJson<{ name: string }>(
        `/v2/projects/${projectId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: "Updated Integration Project",
            positions: [],
            costgroup_distributions: [],
            category_distributions: [],
            position_groupings: [],
          }),
        },
      );
      expect(status).toBe(200);
      expect(body.name).toBe("Updated Integration Project");
    });
  });

  describe("POST /v2/projects/:id/duplicate", () => {
    it("duplicates a project", async () => {
      const res = await api(`/v2/projects/${projectId}/duplicate`, { method: "POST" });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      expect(body.id).not.toBe(projectId);
    });
  });

  describe("GET /v2/projects/potential_invoices", () => {
    it("returns potential invoices list", async () => {
      const res = await api("/v2/projects/potential_invoices");
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /v2/projects/:id", () => {
    it("deletes a project", async () => {
      const employees = await apiPaginated<{ id: number }>("/v2/employees");
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      const personRes = await api("/v2/people", {
        method: "POST",
        body: JSON.stringify({
          person: { type: "Person", first_name: "ProjDel", last_name: "C", email: `pdel-${Date.now()}@example.com`, rate_group_id: rateGroups[0].id, hidden: false, comment: "" },
          tags: [], phone_numbers: [], addresses: [{ city: "X", country: "CH", zip: 1000, street: "X" }],
        }),
      });
      const person = (await personRes.json()) as { id: number; addresses: { id: number }[] };
      const createRes = await api("/v2/projects", {
        method: "POST",
        body: JSON.stringify({
          accountant_id: employees.data[0].id, address_id: person.addresses[0].id, customer_id: person.id,
          description: "del", name: `ProjDel ${Date.now()}`, rate_group_id: rateGroups[0].id,
          location_id: null, deadline: null, fixed_price: null, archived: false, chargeable: false, vacation_project: false,
          positions: [], costgroup_distributions: [], category_distributions: [], position_groupings: [],
        }),
      });
      const { id } = (await createRes.json()) as { id: number };
      const res = await api(`/v2/projects/${id}`, { method: "DELETE" });
      expect([200, 204]).toContain(res.status);
    });
  });
});
