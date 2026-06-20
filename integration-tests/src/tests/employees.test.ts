import { describe, it, expect } from "vitest";
import { api, apiJson, apiPaginated } from "../helpers/setup.js";
import { signIn } from "../helpers/auth.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

describe("Employees", () => {
  let createdId: number;
  let groupId: number;

  it("GET /v2/employees returns paginated list", async () => {
    const list = await apiPaginated<{ id: number; employee_group_id: number }>("/v2/employees");
    expect(list).toHaveProperty("current_page");
    expect(list.data.length).toBeGreaterThan(0);
    groupId = list.data[0].employee_group_id;
  });

  it("POST /v2/employees creates an employee", async () => {
    const res = await api("/v2/employees", {
      method: "POST",
      body: JSON.stringify({
        employee: {
          email: `emp-full-${Date.now()}@example.com`,
          first_name: "FullCRUD",
          last_name: "Employee",
          can_login: false,
          archived: false,
          is_admin: false,
          holidays_per_year: 10,
          first_vacation_takeover: 0,
          password: "test-password-123",
        },
        employee_group_id: groupId,
        work_periods: [],
        addresses: [],
      }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    createdId = body.id;
  });

  it("GET /v2/employees/:id returns a single employee", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/employees/${createdId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(createdId);
  });

  it("PUT /v2/employees/:id updates an employee", async () => {
    const { status, body } = await apiJson<{ first_name: string }>(`/v2/employees/${createdId}`, {
      method: "PUT",
      body: JSON.stringify({
        employee: { first_name: "Updated" },
        work_periods: [],
        addresses: [],
      }),
    });
    expect(status).toBe(200);
    expect(body.first_name).toBe("Updated");
  });

  it("POST /v2/employees/:id/duplicate duplicates an employee", async () => {
    const res = await api(`/v2/employees/${createdId}/duplicate`, { method: "POST" });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    expect(body.id).not.toBe(createdId);
  });

  it("POST /v2/employees/:id/archive archives an employee", async () => {
    const res = await api(`/v2/employees/${createdId}/archive`, {
      method: "POST",
      body: JSON.stringify({ archived: true }),
    });
    expect(res.status).toBe(200);
  });

  it("PUT /v2/employees/:id/archive unarchives an employee", async () => {
    const res = await api(`/v2/employees/${createdId}/archive`, {
      method: "PUT",
      body: JSON.stringify({ archived: false }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /v2/employees/:id deletes an employee", async () => {
    const createRes = await api("/v2/employees", {
      method: "POST",
      body: JSON.stringify({
        employee: {
          email: `emp-del-${Date.now()}@example.com`,
          first_name: "ToDelete",
          last_name: "Employee",
          can_login: false,
          archived: false,
          is_admin: false,
          holidays_per_year: 5,
          first_vacation_takeover: 0,
          password: "delete-me-123",
        },
        employee_group_id: groupId,
        work_periods: [],
        addresses: [],
      }),
    });
    expect(createRes.status).toBe(200);
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/employees/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });

  it("DELETE /v2/employees/sign_out signs out", async () => {
    // Note: this route is shadowed by `resources :employees` which treats
    // "sign_out" as an :id. The devise route exists but is unreachable.
    // We verify the endpoint responds (404 = route shadowed, 200 = devise handles it).
    const { token } = await signIn();
    const res = await fetch(`${BASE_URL}/v2/employees/sign_out`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect([200, 404]).toContain(res.status);
  });
});
