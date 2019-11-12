import { FormikBag } from 'formik';
import { Moment } from 'moment';

// --
// Domain Types
// --

export interface Offer {
  id?: number;
  accountant_id: number;
  address_id: number;
  customer_id: number;
  description: string;
  fixed_price: number | null;
  fixed_price_vat: null | number;
  name: string;
  rate_group_id: number;
  short_description: string;
  status: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  breakdown: Breakdown;
  invoice_ids: number[];
  project_id?: number;
  discounts: OfferDiscount[];
  positions: OfferPosition[];
}

export interface Breakdown {
  discounts: BreakdownDiscount[];
  discountTotal: number;
  positions: OfferPosition[];
  rawTotal: number;
  subtotal: number;
  total: number;
  vats: Vat[];
  vatTotal: number;
}

export interface BreakdownDiscount {
  name: string;
  value: number;
}

export interface Vat {
  factor: number;
  vat: string;
  value: number;
}

export interface OfferDiscount {
  id: number;
  name: string;
  offer_id: number;
  percentage: boolean;
  value: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface OfferPosition {
  id: number;
  amount: number;
  offer_id: number;
  order: number;
  price_per_rate: number;
  rate_unit_id: number;
  service_id: number;
  vat: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  archived: boolean;
  email: string;
  can_login: boolean;
  is_admin: boolean;
  id: number;
  first_name: string;
  last_name: string;
  createdAt: string;
  updatedAt: string;
  holidays_per_year: number | null;
  realTime: number;
  targetTime: number;
  extendTimetrack: boolean;
  password: string;
  work_periods: WorkPeriod[];
  employee_group_id: number | null;
  group_name?: string;
  group?: {
    id: number;
    name: string;
  };
}

export interface PhoneNumber {
  id: number;
  category: number;
  number: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id?: number;
  accountant_id: number;
  customer_id: number;
  address_id: number;
  archived: boolean;
  category_id: number;
  chargeable: boolean;
  costgroup_distributions: ProjectCostgroup[];
  deadline: null;
  description: string | null;
  fixed_price: null | number;
  fixed_price_vat: null | number;
  name: string;
  offer_id?: number;
  rate_group_id: number;
  vacation_project: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  budget_price: number;
  budget_time: number;
  current_price: number;
  current_time: number;
  positions: ProjectPosition[];
  offer: Offer;
  invoice_ids: number[];
}

export interface ProjectCostgroup {
  id: number;
  costgroup_number: number;
  project_id: number;
  weight: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id?: number;
  name: string;
  description: string;
  vat: number;
  chargeable: boolean;
  archived: boolean;
  service_rates: ServiceRate[];
  order: number;
}

export interface ServiceRate {
  id?: number;
  rate_group_id: number;
  service_id: number;
  rate_unit_id: number;
  value: number;
}

export interface ServiceListing {
  id: number;
  name: string;
  description: string;
  archived: boolean;
}

export interface ProjectPosition {
  id?: number;
  description: string;
  price_per_rate: number;
  project_id: number;
  rate_unit_id: number;
  service_id: number;
  vat: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  charge: number;
  calculated_vat: number;
  efforts_value_with_unit: string;
  is_time: boolean;
  service: Service;
  order: number;
}

export interface Status {
  id: number;
  createdAt: string;
  updatedAt: string;
  text: string;
  active: boolean;
}

export interface Invoice {
  id?: number;
  accountant_id: number;
  customer_id: number;
  address_id: number;
  breakdown: Breakdown;
  description: string;
  end: string;
  fixed_price: null | number;
  fixed_price_vat: null | number;
  project_id?: number;
  offer_id?: number;
  name: string;
  start: string;
  deleted_at: null;
  created_at: string;
  updated_at: string;
  costgroup_distributions: InvoiceCostgroup[];
  discounts: InvoiceDiscount[];
  positions: InvoicePosition[];
  sibling_invoice_ids: number[];
}

export interface InvoiceCostgroup {
  id: number;
  costgroup_number: number;
  invoice_id: number;
  weight: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface InvoicePosition {
  id: number;
  amount: number;
  description: string;
  invoice_id: number;
  order: null | number;
  price_per_rate: number;
  project_position_id: number;
  rate_unit_id: number;
  vat: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceDiscount {
  id: number;
  invoice_id: number;
  name: string;
  percentage: boolean;
  value: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface Costgroup {
  number: number;
  name: string;
}

export interface ProjectEffort {
  id?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  date: string;
  employee_id: number;
  position_id: number;
  project_id?: number;
  value: number;
}

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

export interface ProjectEffortListing {
  id: number;
  date: string;
  effort_value: number;
  effort_employee_id: number;
  position_description: string;
  project_id: number;
  project_name: string;
  service_id: number;
  service_name: string;
  employee_full_name: string;
  effort_unit: string;
  rate_unit_factor?: number;
  rate_unit_is_time: boolean;
}

export interface ProjectEffortTemplate {
  comment: string;
  date: Moment;
  employee_ids: number[];
  position_id: number | null;
  project_id: number | null;
  value: number;
}

export interface ProjectComment {
  id?: number;
  comment: string;
  date: Moment | string;
  project_id?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Company {
  type: 'company';
  id: number;
  comment: string;
  email: string;
  hidden: boolean;
  name: string;
  rate_group_id: number;
  tags?: number[];
  persons?: number[];
  addresses?: Address[];
  phone_numbers?: PhoneNumber[];
}

export interface PaginatedCompanyListing extends PaginationInfo {
  data: Company[];
}

export interface Person {
  type: 'person';
  id: number;
  comment: string;
  company?: Company;
  company_id: number | null;
  department: string | null;
  email: string;
  first_name: string;
  hidden: boolean;
  last_name: string;
  rate_group_id: number | null;
  salutation: string;
  tags: number[];
  addresses?: Address[];
  phone_numbers?: PhoneNumber[];
}

export interface PaginatedPersonListing extends PaginationInfo {
  data: Person[];
}

export type Customer = Person | Company;

export interface Address {
  id: number;
  city: string;
  country: string;
  customer_id: number;
  description: string;
  postcode: number;
  street: string;
  supplement: null | string;
  created_at: string;
  updated_at: string;
}

export interface WorkPeriod {
  id: number;
  created_at: string;
  deleted_at: null;
  effective_time: number;
  effort_till_today: number;
  employee_id: number;
  end: string;
  pensum: number;
  period_vacation_budget: number;
  remaining_vacation_budget: number;
  target_time: number;
  start: string;
  updated_at: string;
  vacation_takeover: number;
  yearly_vacation_budget: number;
}

export interface CustomerFilter {
  customer_tags: number[];
  export_format: number;
  include_hidden: boolean;
}

export interface EmployeeListing {
  id: number;
  archived: boolean;
  email: string;
  first_name: string;
  last_name: string;
  can_login: boolean;
}

export interface PaginatedEmployeeListing extends PaginationInfo {
  data: Employee[];
}

export interface ProjectListing {
  id: number;
  accountant_id: number;
  customer_id: number | null;
  address_id: number;
  archived: boolean;
  category_id: number;
  chargeable: boolean;
  deadline: null | string;
  description: string;
  fixed_price: number | null;
  name: string;
  offer_id: number | null;
  rate_group_id: number;
  vacation_project: boolean;
  created_at: string;
  updated_at: string;
  deletable: boolean;
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
  per_page: number;
}

export interface PaginatedProjectListing extends PaginationInfo {
  data: ProjectListing[];
}

export interface InvoiceListing {
  id: number;
  accountant_id: number;
  address_id: number;
  description: string;
  end: string;
  fixed_price: null;
  fixed_price_vat: null;
  project_id: number;
  name: string;
  start: string;
}

export interface PaginatedInvoiceListing extends PaginationInfo {
  data: InvoiceListing[];
}

export interface OfferListing {
  id: number;
  name: string;
  short_description: string;
}

export interface PaginatedOfferListing extends PaginationInfo {
  data: OfferListing[];
}

export interface RateGroup {
  id: number;
  name: string;
  description: string;
}

export interface CustomerTag {
  id: number;
  archived: boolean;
  name: string;
}

export interface Holiday {
  id: number;
  duration: number;
  date: DimeDate;
  name: string;
}

export interface ProjectCategory {
  archived: boolean;
  id: number;
  name: string;
}

export interface RateUnit {
  id: number;
  billing_unit: string;
  effort_unit: string;
  factor: number;
  is_time: boolean;
  name: string;
  archived: boolean;
}

export interface EmployeeGroup {
  name: string;
  id: number;
}

// --
// Helper types
// --

// tslint:disable-next-line:no-any ; really don't care for that type, and it comes from deep inside Formik
export type HandleFormikSubmit<Values> = (values: Values, formikBag: FormikBag<any, Values>) => void;

export interface Listing {
  id?: number;
  archived?: boolean;
}

export type DimeDate = string;

// If we'd type thoroughly we'd need to create a type for each models representation in a form / yup validation schema
// tslint:disable-next-line:no-any
export type FormValues = any;
