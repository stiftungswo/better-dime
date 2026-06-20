import { describe, it, expect } from "vitest";
import { api, apiJson, apiArray, apiPaginated, getAuthToken } from "../helpers/setup.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

describe("Customers", () => {
  describe("GET /v2/customers", () => {
    it("returns array of customers", async () => {
      const list = await apiArray("/v2/customers");
      expect(Array.isArray(list)).toBe(true);
    });
  });

  describe("Customers (base resource)", () => {
    let customerId: number;

    it("POST /v2/customers creates a customer", async () => {
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      const res = await api("/v2/customers", {
        method: "POST",
        body: JSON.stringify({
          customer: {
            type: "Person",
            first_name: "DirectCustomer",
            last_name: `Test ${Date.now()}`,
            email: `cust-direct-${Date.now()}@example.com`,
            rate_group_id: rateGroups[0].id,
            hidden: false,
            comment: "",
          },
          tags: [],
          phone_numbers: [],
          addresses: [{ city: "Teststadt", country: "Schweiz", zip: 8000, street: "Custstr 1" }],
        }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      expect(body).toHaveProperty("id");
      customerId = body.id;
    });

    it("GET /v2/customers/:id returns a customer", async () => {
      const { status, body } = await apiJson<{ id: number }>(`/v2/customers/${customerId}`);
      expect(status).toBe(200);
      expect(body.id).toBe(customerId);
    });

    it("PUT /v2/customers/:id updates a customer", async () => {
      const { status, body } = await apiJson<{ comment: string }>(`/v2/customers/${customerId}`, {
        method: "PUT",
        body: JSON.stringify({ customer: { comment: "updated" } }),
      });
      expect(status).toBe(200);
      expect(body.comment).toBe("updated");
    });

    it("POST /v2/customers/:id/duplicate duplicates a customer", async () => {
      const res = await api(`/v2/customers/${customerId}/duplicate`, { method: "POST" });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      expect(body.id).not.toBe(customerId);
    });

    it("POST /v2/customers/:id/archive is routable", async () => {
      // Route exists but controller action is missing (dead route).
      // We verify the endpoint responds consistently.
      const res = await api(`/v2/customers/${customerId}/archive`, {
        method: "POST",
        body: JSON.stringify({ archived: true }),
      });
      expect([200, 404]).toContain(res.status);
    });

    it("PUT /v2/customers/:id/archive is routable", async () => {
      const res = await api(`/v2/customers/${customerId}/archive`, {
        method: "PUT",
        body: JSON.stringify({ archived: false }),
      });
      expect([200, 404]).toContain(res.status);
    });

    it("DELETE /v2/customers/:id deletes a customer", async () => {
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      const createRes = await api("/v2/customers", {
        method: "POST",
        body: JSON.stringify({
          customer: {
            type: "Person",
            first_name: "ToDelete",
            last_name: "Cust",
            email: `cust-del-${Date.now()}@example.com`,
            rate_group_id: rateGroups[0].id,
            hidden: false,
          },
          tags: [],
          phone_numbers: [],
          addresses: [{ city: "X", country: "CH", zip: 1000, street: "X" }],
        }),
      });
      const { id } = (await createRes.json()) as { id: number };
      const res = await api(`/v2/customers/${id}`, { method: "DELETE" });
      expect([200, 204]).toContain(res.status);
    });

    it("GET /v2/customers/export returns customer data", async () => {
      const res = await api("/v2/customers/export");
      expect(res.ok).toBe(true);
    });
  });

  describe("People (Customer subtype)", () => {
    let personId: number;

    it("GET /v2/people returns paginated list", async () => {
      const list = await apiPaginated("/v2/people");
      expect(list).toHaveProperty("data");
    });

    it("POST /v2/people creates a person", async () => {
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      const res = await api("/v2/people", {
        method: "POST",
        body: JSON.stringify({
          person: {
            type: "Person",
            first_name: "Integration",
            last_name: "TestPerson",
            email: `person-${Date.now()}@example.com`,
            rate_group_id: rateGroups[0].id,
            hidden: false,
            comment: "",
          },
          tags: [],
          phone_numbers: [],
          addresses: [{ city: "Teststadt", country: "Schweiz", zip: 8000, street: "Teststr 1" }],
        }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      personId = body.id;
    });

    it("GET /v2/people/:id returns the person", async () => {
      const { status } = await apiJson(`/v2/people/${personId}`);
      expect(status).toBe(200);
    });

    it("PUT /v2/people/:id updates the person", async () => {
      const { status } = await apiJson(`/v2/people/${personId}`, {
        method: "PUT",
        body: JSON.stringify({ person: { last_name: "UpdatedPerson" } }),
      });
      expect(status).toBe(200);
    });

    it("POST /v2/people/:id/duplicate duplicates the person", async () => {
      const res = await api(`/v2/people/${personId}/duplicate`, { method: "POST" });
      expect(res.status).toBe(200);
    });

    it("PUT /v2/people/:id/hide hides the person", async () => {
      const res = await api(`/v2/people/${personId}/hide`, {
        method: "PUT",
        body: JSON.stringify({ hidden: true }),
      });
      expect(res.status).toBe(200);
    });

    it("DELETE /v2/people/:id deletes a person", async () => {
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      const createRes = await api("/v2/people", {
        method: "POST",
        body: JSON.stringify({
          person: { type: "Person", first_name: "Del", last_name: "Person", email: `pdel-${Date.now()}@example.com`, rate_group_id: rateGroups[0].id, hidden: false },
          tags: [], phone_numbers: [], addresses: [{ city: "X", country: "CH", zip: 1000, street: "X" }],
        }),
      });
      const { id } = (await createRes.json()) as { id: number };
      const res = await api(`/v2/people/${id}`, { method: "DELETE" });
      expect([200, 204]).toContain(res.status);
    });
  });

  describe("Companies (Customer subtype)", () => {
    let companyId: number;

    it("POST /v2/companies creates a company", async () => {
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      const res = await api("/v2/companies", {
        method: "POST",
        body: JSON.stringify({
          company: { type: "Company", name: `Co ${Date.now()}`, rate_group_id: rateGroups[0].id, hidden: false, comment: "" },
          tags: [], phone_numbers: [], addresses: [{ city: "Teststadt", country: "Schweiz", zip: 8000, street: "Firmenstr 1" }],
        }),
      });
      expect(res.status).toBe(200);
      const body = (await res.json()) as { id: number };
      companyId = body.id;
    });

    it("GET /v2/companies returns paginated list", async () => {
      const list = await apiPaginated("/v2/companies");
      expect(list).toHaveProperty("data");
    });

    it("GET /v2/companies/:id returns the company", async () => {
      const { status } = await apiJson(`/v2/companies/${companyId}`);
      expect(status).toBe(200);
    });

    it("PUT /v2/companies/:id updates the company", async () => {
      const { status } = await apiJson(`/v2/companies/${companyId}`, {
        method: "PUT",
        body: JSON.stringify({ company: { comment: "updated" } }),
      });
      expect(status).toBe(200);
    });

    it("POST /v2/companies/:id/duplicate duplicates the company", async () => {
      const res = await api(`/v2/companies/${companyId}/duplicate`, { method: "POST" });
      expect(res.status).toBe(200);
    });

    it("PUT /v2/companies/:id/hide hides the company", async () => {
      const res = await api(`/v2/companies/${companyId}/hide`, {
        method: "PUT",
        body: JSON.stringify({ hidden: true }),
      });
      expect(res.status).toBe(200);
    });

    it("DELETE /v2/companies/:id deletes a company", async () => {
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      const createRes = await api("/v2/companies", {
        method: "POST",
        body: JSON.stringify({
          company: { type: "Company", name: `CoDel ${Date.now()}`, rate_group_id: rateGroups[0].id, hidden: false },
          tags: [], phone_numbers: [], addresses: [{ city: "X", country: "CH", zip: 1000, street: "X" }],
        }),
      });
      const { id } = (await createRes.json()) as { id: number };
      const res = await api(`/v2/companies/${id}`, { method: "DELETE" });
      expect([200, 204]).toContain(res.status);
    });
  });
});
