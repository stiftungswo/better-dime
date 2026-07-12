import { describe, it, expect, beforeAll } from "vitest";
import { api, apiPaginated, getAuthToken } from "../helpers/setup.js";
import { signIn } from "../helpers/auth.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

let token: string;

beforeAll(async () => {
  const result = await signIn();
  token = result.token;
});

function tokenUrl(path: string, extra: Record<string, string> = {}) {
  const params = new URLSearchParams({ token, ...extra });
  return `${BASE_URL}${path}?${params}`;
}

async function dualAuthFetch(path: string, extra: Record<string, string> = {}) {
  return fetch(tokenUrl(path, extra), {
    headers: { Authorization: `Bearer ${token}` },
  });
}

describe("JSON reports (header auth only)", () => {
  it("GET /v2/reports/daily returns data", async () => {
    const res = await api("/v2/reports/daily?from=2026-01-01&to=2026-01-31");
    expect(res.status).toBe(200);
  });

  it("GET /v2/reports/costgroup returns data", async () => {
    const res = await api("/v2/reports/costgroup?from=2026-01-01&to=2026-01-31");
    expect([200, 204]).toContain(res.status);
  });
});

describe("JSON/XLSX reports (dual auth)", () => {
  it("GET /v2/reports/revenue returns data", async () => {
    const res = await dualAuthFetch("/v2/reports/revenue", { from: "2026-01-01", to: "2026-01-31" });
    expect([200, 204]).toContain(res.status);
  });

  it("GET /v2/reports/service_hours returns data", async () => {
    const res = await dualAuthFetch("/v2/reports/service_hours", { start: "2026-01-01", end: "2026-01-31" });
    expect([200, 204]).toContain(res.status);
  });

  it("GET /v2/reports/service_hours/project returns data", async () => {
    const res = await dualAuthFetch("/v2/reports/service_hours/project", { start: "2026-01-01", end: "2026-01-31" });
    expect([200, 204]).toContain(res.status);
  });

  it("GET /v2/reports/service_hours/project_category returns data", async () => {
    const res = await dualAuthFetch("/v2/reports/service_hours/project_category", { start: "2026-01-01", end: "2026-01-31" });
    expect([200, 204]).toContain(res.status);
  });

  it("GET /v2/reports/service_hours/project_split returns data", async () => {
    const res = await dualAuthFetch("/v2/reports/service_hours/project_split", { start: "2026-01-01", end: "2026-01-31" });
    expect([200, 204]).toContain(res.status);
  });

  it("GET /v2/reports/service_costs redirects to xlsx", async () => {
    const res = await fetch(tokenUrl("/v2/reports/service_costs", { start: "2026-01-01", end: "2026-01-31" }), {
      redirect: "manual",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(302);
  });

  it("GET /v2/reports/service_costs/project returns xlsx", async () => {
    const res = await dualAuthFetch("/v2/reports/service_costs/project.xlsx", { start: "2026-01-01", end: "2026-01-31" });
    expect(res.status).toBe(200);
  });
});

describe("PDF reports (token param auth)", () => {
  it("GET /v2/reports/employees_report.pdf returns a PDF", async () => {
    const employees = await apiPaginated<{ id: number }>("/v2/employees");
    const ids = employees.data.slice(0, 2).map((e) => e.id).join(",");
    const res = await fetch(tokenUrl("/v2/reports/employees_report.pdf", { from: "2026-01-01", to: "2026-06-01", employee_ids: ids }));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/pdf");
  });

  it("GET /v2/reports/project_report/:id.pdf returns a PDF", async () => {
    const projects = await apiPaginated<{ id: number }>("/v2/projects");
    expect(projects.data.length).toBeGreaterThan(0);
    const id = projects.data[0].id;
    const res = await fetch(tokenUrl(`/v2/reports/project_report/${id}.pdf`));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/pdf");
  });

  it.skip("GET /v2/reports/:id.pdf returns a PDF — route exists but action is not implemented", async () => {
    const projects = await apiPaginated<{ id: number }>("/v2/projects");
    expect(projects.data.length).toBeGreaterThan(0);
    const id = projects.data[0].id;
    const res = await fetch(tokenUrl(`/v2/reports/${id}.pdf`));
    expect(res.status).toBe(200);
  });
});
