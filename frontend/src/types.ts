import { FormikBag } from 'formik';
import { Moment } from 'moment';
import type { paths } from './types/generated';

// Extracts the GET 200 JSON response type for a given API path.
type GetResponse<P extends keyof paths> =
  paths[P] extends { get: { responses: { 200: { content: { 'application/json': infer R } } } } }
    ? R : never;

// Extracts the POST or PUT request body type for a given API path.
type GetRequest<P extends keyof paths, M extends 'post' | 'put' = 'post'> =
  paths[P] extends { [K in M]: { requestBody?: { content: { 'application/json': infer R } } } }
    ? R : never;

// --
// API response types — all derived from the generated OpenAPI schema.
// These reflect what the API actually returns; do not add fields here.
// --

// Simple lookup entities
export type RateGroup = GetResponse<'/v2/rate_groups'>[number];
export type Holiday = GetResponse<'/v2/holidays'>[number];
export type Location = GetResponse<'/v2/locations/{id}'>;
export type EmployeeGroup = GetResponse<'/v2/employee_groups/{id}'>;
export type CustomerTag = GetResponse<'/v2/customer_tags/{id}'>;
export type Category = GetResponse<'/v2/project_categories/{id}'>;
export type RateUnit = GetResponse<'/v2/rate_units/{id}'>;
export type RateUnitListing = GetResponse<'/v2/rate_units'>['data'][number];
export type Costgroup = GetResponse<'/v2/costgroups'>[number];

// Service types
export type Service = GetResponse<'/v2/services/{id}'>;
export type ServiceRate = Service['service_rates'][number];
export type ServiceCategoryStub = Service['service_category'];
export type ServiceCategory = GetResponse<'/v2/service_categories'>[number];
export type ServiceListing = GetResponse<'/v2/services'>['data'][number];

// Employee
export type Employee = GetResponse<'/v2/employees/{id}'>;
export type WorkPeriod = Employee['work_periods'][number];
export type EmployeeListing = GetResponse<'/v2/employees'>['data'][number];

// Offer domain
export type Offer = GetResponse<'/v2/offers/{id}'>;
export type OfferPosition = Offer['positions'][number];
export type OfferDiscount = Offer['discounts'][number];
export type OfferCategory = Offer['category_distributions'][number];
export type OfferCostgroup = Offer['costgroup_distributions'][number];
export type OfferListing = GetResponse<'/v2/offers'>['data'][number];

// Project domain
export type Project = GetResponse<'/v2/projects/{id}'>;
export type ProjectPosition = Project['positions'][number];
export type ProjectCategory = Project['category_distributions'][number];
export type ProjectCostgroup = Project['costgroup_distributions'][number];
export type ProjectListing = GetResponse<'/v2/projects'>['data'][number];

// Invoice domain
export type Invoice = GetResponse<'/v2/invoices/{id}'>;
export type InvoicePosition = Invoice['positions'][number];
export type InvoiceDiscount = Invoice['discounts'][number];
export type InvoiceCostgroup = Invoice['costgroup_distributions'][number];
export type InvoiceListing = GetResponse<'/v2/invoices'>['data'][number];

// Shared position group (same shape in Offer / Project / Invoice)
export type PositionGroup = Offer['position_groupings'][number];

// Used by position-group dialogs: any entity that carries a position_groupings array.
// Generic parameter T is unused (always `any` at call sites) — kept for backwards compat.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface PositionGroupings<T> {
  position_groupings: PositionGroup[];
}

// Shared union for category/costgroup subforms that render for Offer and Project.
export type OPCategory = OfferCategory | ProjectCategory;

// Shared type for costgroup subforms across Offer/Project/Invoice.
// distribution is a server-computed percentage field present on project costgroups.
export interface OPICostgroup {
  costgroup_number: number;
  weight: number;
  distribution?: number;
}

// Customer STI — generated uses `type: string`; we tighten to a literal discriminator
export type Company = Omit<GetResponse<'/v2/companies/{id}'>, 'type'> & { type: 'company' };
export type Person = Omit<GetResponse<'/v2/people/{id}'>, 'type'> & { type: 'person' };
export type Customer = Company | Person;
export type Address = GetResponse<'/v2/companies/{id}'>['addresses'][number];
export type PhoneNumber = GetResponse<'/v2/companies/{id}'>['phone_numbers'][number];

// Project efforts and comments
export type ProjectEffortListing = GetResponse<'/v2/project_efforts'>[number];
export type ProjectEffort = GetResponse<'/v2/project_efforts/{id}'>;
export type ProjectCommentListing = GetResponse<'/v2/project_comments'>[number];
export type ProjectComment = GetResponse<'/v2/project_comments/{id}'>;
export type ProjectCommentPreset = GetResponse<'/v2/project_comment_presets'>['data'][number];

// --
// Create / mutation types — POST/PUT payload shapes, derived from the generated spec where possible.
// Top-level entity types (Offer, Project, Invoice, Service) are derived via GetRequest<P>.
// Sub-entity join types use Create<T> (strips id/timestamps) or stay manual where the
// read and write shapes diverge (e.g. ProjectEffortCreate, ProjectCommentCreate).
// --

// Derives a POST/PUT payload type from a response type.
// Makes id optional and strips server-set timestamps.
// Only works for types whose write shape matches the read shape (simple entities).
// Top-level types (Offer, Project, Invoice) and types with structural mismatches
// between read and write (ProjectCostgroup, PositionGroup, positions) stay manual.
export type Create<T extends { id: number }> =
  Omit<T, 'id' | 'created_at' | 'updated_at'> & { id?: number };

export type OfferCreate = GetRequest<'/v2/offers'> & { id?: number };
export type OfferDiscountCreate = Create<OfferDiscount>;
export type OfferCategoryCreate = Create<OfferCategory>;
export type OfferCostgroupCreate = Create<OfferCostgroup>;

export type ProjectCreate = GetRequest<'/v2/projects'> & { id?: number };
export type ProjectCategoryCreate = Create<ProjectCategory>;

export type InvoiceCreate = GetRequest<'/v2/invoices'> & { id?: number };
export type InvoiceDiscountCreate = Create<InvoiceDiscount>;

export type ServiceCreate = GetRequest<'/v2/services'> & { id?: number };

export type ServiceRateCreate = Create<ServiceRate>;

export interface ProjectEffortCreate {
  id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  date: string;
  employee_id: number;
  position_id: number;
  project_id?: number;
  costgroup_number?: number;
  value: number;
}

export interface ProjectCommentCreate {
  id?: number;
  comment: string | null;
  date: Moment | string;
  project_id?: number;
}

export type ProjectCommentPresetCreate = Create<ProjectCommentPreset>;

// --
// Breakdown — derived from the Offer response; Invoice uses the same shape.
// --

export type Breakdown = Offer['breakdown'];
export type BreakdownDiscount = Breakdown['discounts'][number];

// --
// Frontend-only types — no API counterpart
// --

export interface ProjectEffortFilter {
  start: Moment;
  end: Moment;
  combineTimes: boolean;
  employeeIds: number[];
  serviceIds: number[];
  showEmptyGroups: boolean;
  projectIds: number[];
  showProjectComments: boolean;
}

export interface ProjectEffortTemplate {
  comment: string;
  date: Moment;
  employee_ids: number[];
  position_id: number | null;
  project_id: number | null;
  costgroup_number: number | null;
  value: number;
}

export interface CustomerOverviewFilter {
  tags: number[];
}

export interface CustomerExportFilter {
  customer_tags: number[];
  export_format: number;
  showArchived: boolean;
}

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: null | string;
  prev_page_url: null | string;
  path: string;
  per_page: string;
}

export interface PaginatedData<T> extends PaginationInfo {
  data: T[];
}

export interface Status {
  id: number;
  createdAt: string;
  updatedAt: string;
  text: string;
  active: boolean;
}

export type Locale = 'de' | 'fr'; // | 'en';

// --
// Helper types
// --

// tslint:disable-next-line:no-any ; really don't care for that type, and it comes from deep inside Formik
export type HandleFormikSubmit<Values> = (values: Values, formikBag: FormikBag<any, Values>) => void;

export interface Listing {
  id?: number;
  archived?: boolean;
  deletable?: boolean;
}

export type DimeDate = string;

// If we'd type thoroughly we'd need to create a type for each models representation in a form / yup validation schema
// tslint:disable-next-line:no-any
export type FormValues = any;

export interface SelectedAction {
  icon: React.ComponentType;
  title: string;
  action: (selectedIds: number[]) => void;
}
