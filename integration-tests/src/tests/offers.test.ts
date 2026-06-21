import { describe, it, expect, beforeAll } from "vitest";
import { api, apiJson, apiPaginated, apiArray, getAuthToken } from "../helpers/setup.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

describe("Offers", () => {
  let offerId: number;
  let rateGroupId: number;
  let employeeId: number;
  let customerId: number;
  let addressId: number;
  let token: string;

  let costgroupNumber: number;
  let categoryId: number;

  beforeAll(async () => {
    token = await getAuthToken();
    const employees = await apiPaginated<{ id: number }>("/v2/employees");
    expect(employees.data.length).toBeGreaterThan(0);
    employeeId = employees.data[0].id;
    const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
    expect(rateGroups.length).toBeGreaterThan(0);
    rateGroupId = rateGroups[0].id;
    const costgroups = await apiArray<{ number: number }>("/v2/costgroups");
    expect(costgroups.length).toBeGreaterThan(0);
    costgroupNumber = costgroups[0].number;
    const categories = await apiArray<{ id: number }>("/v2/project_categories");
    expect(categories.length).toBeGreaterThan(0);
    categoryId = categories[0].id;

    const personRes = await api("/v2/people", {
      method: "POST",
      body: JSON.stringify({
        person: { type: "Person", first_name: "OfferTest", last_name: "Cust", email: `offer-${Date.now()}@example.com`, rate_group_id: rateGroupId, hidden: false, comment: "" },
        tags: [], phone_numbers: [], addresses: [{ city: "Test", country: "CH", zip: 8000, street: "Str 1" }],
      }),
    });
    const person = (await personRes.json()) as { id: number; addresses: { id: number }[] };
    customerId = person.id;
    addressId = person.addresses[0].id;
  });

  it("POST /v2/offers creates an offer", async () => {
    const res = await api("/v2/offers", {
      method: "POST",
      body: JSON.stringify({
        accountant_id: employeeId,
        address_id: addressId,
        customer_id: customerId,
        description: "Integration test offer",
        name: `Offer ${Date.now()}`,
        rate_group_id: rateGroupId,
        short_description: "Test",
        status: 1,
        fixed_price: null,
        positions: [],
        discounts: [],
        costgroup_distributions: [{ costgroup_number: costgroupNumber, weight: 100 }],
        category_distributions: [{ category_id: categoryId, weight: 100 }],
        position_groupings: [],
      }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    offerId = body.id;
  });

  it("GET /v2/offers returns paginated list", async () => {
    const list = await apiPaginated("/v2/offers");
    expect(list).toHaveProperty("data");
    expect(list.data.length).toBeGreaterThan(0);
  });

  it("GET /v2/offers/:id returns an offer", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/offers/${offerId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(offerId);
  });

  it("PUT /v2/offers/:id updates an offer", async () => {
    const { status, body } = await apiJson<{ name: string }>(`/v2/offers/${offerId}`, {
      method: "PUT",
      body: JSON.stringify({
        name: "Updated Offer",
        positions: [],
        discounts: [],
        costgroup_distributions: [{ costgroup_number: costgroupNumber, weight: 100 }],
        category_distributions: [{ category_id: categoryId, weight: 100 }],
        position_groupings: [],
      }),
    });
    expect(status).toBe(200);
    expect(body.name).toBe("Updated Offer");
  });

  it("POST /v2/offers/:id/duplicate duplicates an offer", async () => {
    const res = await api(`/v2/offers/${offerId}/duplicate`, { method: "POST" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    expect(body.id).not.toBe(offerId);
  });

  it("POST /v2/offers/:id/create_project creates a project from offer", async () => {
    const res = await api(`/v2/offers/${offerId}/create_project`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
  });

  it("GET /v2/offers/:id/print.pdf endpoint is reachable", async () => {
    const res = await fetch(`${BASE_URL}/v2/offers/${offerId}/print.pdf?token=${token}`);
    expect(res.status).toBe(200);
  });

  it("DELETE /v2/offers/:id deletes an offer", async () => {
    const createRes = await api("/v2/offers", {
      method: "POST",
      body: JSON.stringify({
        accountant_id: employeeId, address_id: addressId, customer_id: customerId,
        description: "del", name: `OfferDel ${Date.now()}`, rate_group_id: rateGroupId,
        short_description: "d", status: 1, fixed_price: null,
        positions: [], discounts: [], costgroup_distributions: [], category_distributions: [], position_groupings: [],
      }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/offers/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });
});
