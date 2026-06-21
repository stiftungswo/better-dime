import { describe, it, expect, beforeAll } from "vitest";
import { api, apiJson, apiPaginated, apiArray, getAuthToken } from "../helpers/setup.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

describe("Invoices", () => {
  let invoiceId: number;
  let projectId: number;
  let employeeId: number;
  let customerId: number;
  let addressId: number;
  let rateGroupId: number;
  let token: string;

  beforeAll(async () => {
    token = await getAuthToken();
    const employees = await apiPaginated<{ id: number }>("/v2/employees");
    employeeId = employees.data[0].id;
    const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
    rateGroupId = rateGroups[0].id;
    const costgroups = await apiArray<{ number: number }>("/v2/costgroups");
    const categories = await apiArray<{ id: number }>("/v2/project_categories");

    const personRes = await api("/v2/people", {
      method: "POST",
      body: JSON.stringify({
        person: { type: "Person", first_name: "InvTest", last_name: "Cust", email: `inv-${Date.now()}@example.com`, rate_group_id: rateGroupId, hidden: false, comment: "" },
        tags: [], phone_numbers: [], addresses: [{ city: "Test", country: "CH", zip: 8000, street: "Str 1" }],
      }),
    });
    const person = (await personRes.json()) as { id: number; addresses: { id: number }[] };
    customerId = person.id;
    addressId = person.addresses[0].id;

    const projRes = await api("/v2/projects", {
      method: "POST",
      body: JSON.stringify({
        accountant_id: employeeId, address_id: addressId, customer_id: customerId,
        description: "inv proj", name: `InvProj ${Date.now()}`, rate_group_id: rateGroupId,
        location_id: null, deadline: null, fixed_price: null, archived: false, chargeable: true, vacation_project: false,
        positions: [],
        costgroup_distributions: costgroups.length > 0 ? [{ costgroup_number: costgroups[0].number, weight: 100 }] : [],
        category_distributions: categories.length > 0 ? [{ category_id: categories[0].id, weight: 100 }] : [],
        position_groupings: [],
      }),
    });
    const proj = (await projRes.json()) as { id: number };
    projectId = proj.id;
  });

  it("POST /v2/invoices creates an invoice", async () => {
    const costgroups = await apiArray<{ number: number }>("/v2/costgroups");
    expect(costgroups.length).toBeGreaterThan(0);
    const res = await api("/v2/invoices", {
      method: "POST",
      body: JSON.stringify({
        accountant_id: employeeId,
        address_id: addressId,
        customer_id: customerId,
        project_id: projectId,
        description: "Integration test invoice",
        name: `Invoice ${Date.now()}`,
        beginning: "2026-01-01",
        ending: "2026-01-31",
        fixed_price: null,
        fixed_price_vat: null,
        positions: [],
        discounts: [],
        costgroup_distributions: [{ costgroup_number: costgroups[0].number, weight: 100 }],
      }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    invoiceId = body.id;
  });

  it("GET /v2/invoices returns paginated list", async () => {
    const list = await apiPaginated("/v2/invoices");
    expect(list).toHaveProperty("data");
    expect(list.data.length).toBeGreaterThan(0);
  });

  it("GET /v2/invoices/:id returns an invoice", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/invoices/${invoiceId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(invoiceId);
  });

  it("PUT /v2/invoices/:id updates an invoice", async () => {
    const costgroups = await apiArray<{ number: number }>("/v2/costgroups");
    const { status, body } = await apiJson<{ name: string }>(`/v2/invoices/${invoiceId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Updated Invoice",
        positions: [],
        discounts: [],
        costgroup_distributions: [{ costgroup_number: costgroups[0].number, weight: 100 }],
      }),
    });
    expect(status).toBe(200);
    expect(body.name).toBe("Updated Invoice");
  });

  it("PUT /v2/invoices/:id/update_timespan updates the timespan", async () => {
    const { status } = await apiJson(`/v2/invoices/${invoiceId}/update_timespan`, {
      method: "PUT",
      body: JSON.stringify({ beginning: "2026-02-01", ending: "2026-02-28" }),
    });
    expect(status).toBe(200);
  });

  it("POST /v2/invoices/:id/duplicate duplicates an invoice", async () => {
    const res = await api(`/v2/invoices/${invoiceId}/duplicate`, { method: "POST" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    expect(body.id).not.toBe(invoiceId);
  });

  it("GET /v2/invoices/:id/print.pdf returns PDF", async () => {
    const freshToken = await getAuthToken();
    const res = await fetch(`${BASE_URL}/v2/invoices/${invoiceId}/print.pdf?token=${freshToken}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/pdf");
  });

  it("GET /v2/invoices/:id/print_qr_bill.pdf returns PDF", async () => {
    const freshToken = await getAuthToken();
    const res = await fetch(`${BASE_URL}/v2/invoices/${invoiceId}/print_qr_bill.pdf?token=${freshToken}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/pdf");
  });

  it("GET /v2/invoices/:id/effort_report.pdf returns PDF", async () => {
    const freshToken = await getAuthToken();
    const res = await fetch(`${BASE_URL}/v2/invoices/${invoiceId}/effort_report.pdf?token=${freshToken}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/pdf");
  });

  it("DELETE /v2/invoices/:id deletes an invoice", async () => {
    const createRes = await api("/v2/invoices", {
      method: "POST",
      body: JSON.stringify({
        accountant_id: employeeId, address_id: addressId, customer_id: customerId,
        project_id: projectId, description: "del", name: `InvDel ${Date.now()}`,
        beginning: "2026-03-01", ending: "2026-03-31",
        positions: [], discounts: [], costgroup_distributions: [],
      }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/invoices/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });

  it("POST /v2/projects/:id/create_invoice creates invoice from project", async () => {
    const res = await api(`/v2/projects/${projectId}/create_invoice`, { method: "POST" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    expect(body).toHaveProperty("id");
  });
});
