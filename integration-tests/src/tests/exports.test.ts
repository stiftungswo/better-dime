import { describe, it, expect, beforeAll } from "vitest";
import { signIn } from "../helpers/auth.js";
import { api, apiPaginated, apiArray } from "../helpers/setup.js";

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:38001";

let token: string;

beforeAll(async () => {
  const result = await signIn();
  token = result.token;
});

function exportUrl(path: string, extra?: Record<string, string>) {
  const params = new URLSearchParams({ token, ...extra });
  return `${BASE_URL}${path}?${params}`;
}

describe("PDF exports", () => {
  describe("Employee effort report", () => {
    it("GET /v2/employees/:id/effort_report.pdf returns a PDF", async () => {
      const employees = await apiPaginated<{ id: number }>("/v2/employees");
      const id = employees.data[0].id;

      const res = await fetch(exportUrl(`/v2/employees/${id}/effort_report.pdf`));

      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/pdf");
      const body = await res.arrayBuffer();
      expect(body.byteLength).toBeGreaterThan(0);
    });
  });

  describe("Project effort report", () => {
    it("GET /v2/projects/:id/effort_report.pdf returns a PDF", async () => {
      const projects = await apiPaginated<{ id: number }>("/v2/projects");
      expect(projects.data.length).toBeGreaterThan(0);
      const id = projects.data[0].id;

      const res = await fetch(exportUrl(`/v2/projects/${id}/effort_report.pdf`));

      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/pdf");
      const body = await res.arrayBuffer();
      expect(body.byteLength).toBeGreaterThan(0);
    });
  });

  describe("Offer print", () => {
    let offerId: number | null = null;

    beforeAll(async () => {
      const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
      const employees = await apiPaginated<{ id: number }>("/v2/employees");
      const costgroups = await apiArray<{ number: number }>("/v2/costgroups");
      const categories = await apiArray<{ id: number }>("/v2/project_categories");

      const personRes = await api("/v2/people", {
        method: "POST",
        body: JSON.stringify({
          person: {
            type: "Person",
            first_name: "OfferPDF",
            last_name: "Test",
            email: `offer-pdf-${Date.now()}@example.com`,
            rate_group_id: rateGroups[0].id,
            hidden: false,
            comment: "",
          },
          tags: [],
          phone_numbers: [],
          addresses: [
            { city: "Teststadt", country: "Schweiz", zip: 8000, street: "PDFstr 1" },
          ],
        }),
      });
      const person = (await personRes.json()) as {
        id: number;
        addresses: { id: number }[];
      };

      const offerRes = await api("/v2/offers", {
        method: "POST",
        body: JSON.stringify({
          accountant_id: employees.data[0].id,
          address_id: person.addresses[0].id,
          customer_id: person.id,
          description: "PDF test offer",
          name: `PDFOffer ${Date.now()}`,
          rate_group_id: rateGroups[0].id,
          short_description: "Test",
          status: 1,
          fixed_price: null,
          positions: [],
          costgroup_distributions: costgroups.length > 0 ? [{ costgroup_number: costgroups[0].number, weight: 100 }] : [],
          category_distributions: categories.length > 0 ? [{ category_id: categories[0].id, weight: 100 }] : [],
          discounts: [],
          position_groupings: [],
        }),
      });
      if (offerRes.status === 200) {
        const offer = (await offerRes.json()) as { id: number };
        offerId = offer.id;
      }
    });

    it("GET /v2/offers/:id/print.pdf endpoint is reachable", async () => {
      expect(offerId).not.toBeNull();
      const res = await fetch(exportUrl(`/v2/offers/${offerId}/print.pdf`));
      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/pdf");
    });
  });

  describe("Invoice print", () => {
    it("GET /v2/invoices/:id/print.pdf returns a PDF if invoice has cost groups", async () => {
      const invoices = await apiPaginated<{
        id: number;
        costgroup_distributions: unknown[];
      }>("/v2/invoices");

      const printable = invoices.data.find(
        (inv) =>
          Array.isArray(inv.costgroup_distributions) &&
          inv.costgroup_distributions.length > 0,
      );
      expect(printable).toBeDefined();

      const res = await fetch(exportUrl(`/v2/invoices/${printable!.id}/print.pdf`));

      expect(res.status).toBe(200);
      expect(res.headers.get("content-type")).toContain("application/pdf");
    });
  });
});

describe("Excel exports", () => {
  describe("Customer import template", () => {
    it("GET /v2/customers/import/template.xlsx returns an XLSX file", async () => {
      const res = await fetch(exportUrl("/v2/customers/import/template.xlsx"));

      expect(res.status).toBe(200);
      const contentType = res.headers.get("content-type") ?? "";
      expect(
        contentType.includes("spreadsheetml") ||
          contentType.includes("octet-stream") ||
          contentType.includes("xlsx"),
      ).toBe(true);
      const body = await res.arrayBuffer();
      expect(body.byteLength).toBeGreaterThan(0);
    });
  });
});

describe("Customer XLSX import", () => {
  it("uploads template to verify endpoint and returns parsed rows", async () => {
    const templateRes = await fetch(
      exportUrl("/v2/customers/import/template.xlsx"),
    );
    expect(templateRes.status).toBe(200);
    const templateBlob = await templateRes.blob();

    const formData = new FormData();
    formData.append("importFile", templateBlob, "template.xlsx");

    const verifyRes = await fetch(
      `${BASE_URL}/v2/customers/import/verify`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );
    expect(verifyRes.status).toBe(200);

    const verified = (await verifyRes.json()) as Array<{
      type: string;
      first_name: string | null;
      name: string | null;
      invalid: boolean;
      street: string;
    }>;
    expect(Array.isArray(verified)).toBe(true);
    expect(verified.length).toBe(2);
    expect(verified[0]).toHaveProperty("type");
    expect(verified[0]).toHaveProperty("street");
  });

  it("imports customers via POST /v2/customers/import", async () => {
    const rateGroups = await apiArray<{ id: number }>("/v2/rate_groups");
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const importRes = await fetch(`${BASE_URL}/v2/customers/import`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customers_to_import: [
          {
            type: "person",
            first_name: "Imported",
            last_name: "Person",
            email: `import-p-${uid}@example.com`,
            rate_group_id: rateGroups[0].id,
            hidden: false,
            archived: false,
            street: "Importstr 1",
            zip: 8000,
            city: "Teststadt",
            country: "Schweiz",
          },
          {
            type: "company",
            name: `ImportedCo ${uid}`,
            email: `import-c-${uid}@example.com`,
            rate_group_id: rateGroups[0].id,
            hidden: false,
            archived: false,
            street: "Importstr 2",
            zip: 8000,
            city: "Teststadt",
            country: "Schweiz",
          },
        ],
      }),
    });
    expect(importRes.status).toBe(200);
    const body = await importRes.text();
    expect(body).toBe("ok");
  });
});

