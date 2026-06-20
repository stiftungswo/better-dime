import { describe, it, expect, beforeAll } from "vitest";
import { api, apiJson, apiArray, apiPaginated } from "../helpers/setup.js";

describe("Project efforts", () => {
  let effortId: number;
  let positionId: number;
  let projectId: number;
  let project2Id: number;
  let position2Id: number;
  let employeeId: number;

  beforeAll(async () => {
    const employees = await apiPaginated<{ id: number }>("/v2/employees");
    employeeId = employees.data[0].id;
    const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
    const rateGroupId = rateGroups[0].id;

    const personRes = await api("/v2/people", {
      method: "POST",
      body: JSON.stringify({
        person: { type: "Person", first_name: "EffTest", last_name: "Cust", email: `eff-${Date.now()}@example.com`, rate_group_id: rateGroupId, hidden: false, comment: "" },
        tags: [], phone_numbers: [], addresses: [{ city: "T", country: "CH", zip: 8000, street: "S" }],
      }),
    });
    const person = (await personRes.json()) as { id: number; addresses: { id: number }[] };

    const ruRes = await api("/v2/rate_units", {
      method: "POST",
      body: JSON.stringify({ name: `RU-Eff ${Date.now()}`, billing_unit: "h", effort_unit: "h", factor: 1, is_time: true, archived: false }),
    });
    const rateUnit = (await ruRes.json()) as { id: number };

    const svcRes = await api("/v2/services", {
      method: "POST",
      body: JSON.stringify({ name: `SvcEff ${Date.now()}`, description: "", vat: 0.077, archived: false }),
    });
    const service = (await svcRes.json()) as { id: number };

    const projRes = await api("/v2/projects", {
      method: "POST",
      body: JSON.stringify({
        accountant_id: employeeId, address_id: person.addresses[0].id, customer_id: person.id,
        description: "eff proj", name: `EffProj ${Date.now()}`, rate_group_id: rateGroupId,
        location_id: null, deadline: null, fixed_price: null, archived: false, chargeable: false, vacation_project: false,
        positions: [{ description: "Pos1", order: 1, price_per_rate: 100, rate_unit_id: rateUnit.id, service_id: service.id, vat: 0.077 }],
        costgroup_distributions: [], category_distributions: [], position_groupings: [],
      }),
    });
    const proj = (await projRes.json()) as { id: number; positions: { id: number }[] };
    projectId = proj.id;
    positionId = proj.positions[0].id;

    const proj2Res = await api("/v2/projects", {
      method: "POST",
      body: JSON.stringify({
        accountant_id: employeeId, address_id: person.addresses[0].id, customer_id: person.id,
        description: "eff proj2", name: `EffProj2 ${Date.now()}`, rate_group_id: rateGroupId,
        location_id: null, deadline: null, fixed_price: null, archived: false, chargeable: false, vacation_project: false,
        positions: [{ description: "Pos2", order: 1, price_per_rate: 50, rate_unit_id: rateUnit.id, service_id: service.id, vat: 0.077 }],
        costgroup_distributions: [], category_distributions: [], position_groupings: [],
      }),
    });
    const proj2 = (await proj2Res.json()) as { id: number; positions: { id: number }[] };
    project2Id = proj2.id;
    position2Id = proj2.positions[0].id;
  });

  it("POST /v2/project_efforts creates an effort", async () => {
    const costgroups = await apiArray<{ number: number }>("/v2/costgroups");
    const cgNumber = costgroups.length > 0 ? costgroups[0].number : 100;
    const res = await api("/v2/project_efforts", {
      method: "POST",
      body: JSON.stringify({ date: "2026-06-01", value: 480, employee_id: employeeId, position_id: positionId, costgroup_number: cgNumber }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    effortId = body.id;
  });

  it("GET /v2/project_efforts returns array", async () => {
    const list = await apiArray("/v2/project_efforts");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("GET /v2/project_efforts/:id returns an effort", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/project_efforts/${effortId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(effortId);
  });

  it("PUT /v2/project_efforts/:id updates an effort", async () => {
    const { status } = await apiJson(`/v2/project_efforts/${effortId}`, {
      method: "PUT",
      body: JSON.stringify({ value: 240 }),
    });
    expect(status).toBe(200);
  });

  it("PUT /v2/project_efforts/move moves efforts", async () => {
    const res = await api("/v2/project_efforts/move", {
      method: "PUT",
      body: JSON.stringify({ effort_ids: String(effortId), project_id: project2Id, position_id: position2Id }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /v2/project_efforts/:id deletes an effort", async () => {
    const costgroups = await apiArray<{ number: number }>("/v2/costgroups");
    const cgNumber = costgroups.length > 0 ? costgroups[0].number : 100;
    const createRes = await api("/v2/project_efforts", {
      method: "POST",
      body: JSON.stringify({ date: "2026-06-02", value: 60, employee_id: employeeId, position_id: position2Id, costgroup_number: cgNumber }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/project_efforts/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });
});

describe("Project comments", () => {
  let commentId: number;
  let projectId: number;
  let project2Id: number;

  beforeAll(async () => {
    const projects = await apiPaginated<{ id: number }>("/v2/projects");
    projectId = projects.data[0].id;
    project2Id = projects.data.length > 1 ? projects.data[1].id : projects.data[0].id;
  });

  it("POST /v2/project_comments creates a comment", async () => {
    const res = await api("/v2/project_comments", {
      method: "POST",
      body: JSON.stringify({ date: "2026-06-01", comment: "Integration test comment", project_id: projectId }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    commentId = body.id;
  });

  it("GET /v2/project_comments returns array", async () => {
    const list = await apiArray("/v2/project_comments");
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it("GET /v2/project_comments/:id returns a comment", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/project_comments/${commentId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(commentId);
  });

  it("PUT /v2/project_comments/:id updates a comment", async () => {
    const { status } = await apiJson(`/v2/project_comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ comment: "Updated comment" }),
    });
    expect(status).toBe(200);
  });

  it("PUT /v2/project_comments/move moves comments", async () => {
    const res = await api("/v2/project_comments/move", {
      method: "PUT",
      body: JSON.stringify({ comment_ids: [commentId], project_id: project2Id }),
    });
    expect(res.status).toBe(200);
  });

  it("DELETE /v2/project_comments/:id deletes a comment", async () => {
    const createRes = await api("/v2/project_comments", {
      method: "POST",
      body: JSON.stringify({ date: "2026-06-02", comment: "To delete", project_id: projectId }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/project_comments/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });
});

describe("Project comment presets (full CRUD)", () => {
  let presetId: number;

  it("POST /v2/project_comment_presets creates a preset", async () => {
    const res = await api("/v2/project_comment_presets", {
      method: "POST",
      body: JSON.stringify({ comment_preset: `Preset ${Date.now()}` }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { id: number };
    presetId = body.id;
  });

  it("GET /v2/project_comment_presets returns paginated list", async () => {
    const list = await apiPaginated("/v2/project_comment_presets");
    expect(list.data.length).toBeGreaterThan(0);
  });

  it("GET /v2/project_comment_presets/:id returns a preset", async () => {
    const { status, body } = await apiJson<{ id: number }>(`/v2/project_comment_presets/${presetId}`);
    expect(status).toBe(200);
    expect(body.id).toBe(presetId);
  });

  it("PUT /v2/project_comment_presets/:id updates a preset", async () => {
    const { status } = await apiJson(`/v2/project_comment_presets/${presetId}`, {
      method: "PUT",
      body: JSON.stringify({ comment_preset: `Updated ${Date.now()}` }),
    });
    expect(status).toBe(200);
  });

  it("DELETE /v2/project_comment_presets/:id deletes a preset", async () => {
    const createRes = await api("/v2/project_comment_presets", {
      method: "POST",
      body: JSON.stringify({ comment_preset: `Del ${Date.now()}` }),
    });
    const { id } = (await createRes.json()) as { id: number };
    const res = await api(`/v2/project_comment_presets/${id}`, { method: "DELETE" });
    expect([200, 204]).toContain(res.status);
  });
});
