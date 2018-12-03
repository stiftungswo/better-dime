//TODO clean this up; either pull the Service types here, or split this up into several files

import { Service } from './views/services/types';
import { FormikBag } from 'formik';

export interface Offer {
  id?: number;
  accountant_id: number;
  address_id: number;
  customer_id: number;
  description: string;
  fixed_price: number | null;
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
  deadline: null;
  description: string;
  fixed_price: null | number;
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
  efforts_value: number;
  is_time: boolean;
  service: Service;
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
  fixed_price: null;
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
  order: null;
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
  start: string;
  end: string;
  combine_times: boolean;
  employee_ids: number[];
  service_ids: number[];
  show_empty_groups: boolean;
  project_ids: number[];
  show_project_comments: boolean;
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
  date: string;
  employee_ids: number[];
  position_id: number | null;
  project_id: number | null;
  value: number;
}

export interface ProjectComment {
  id?: number;
  comment: string;
  date: string;
  project_id?: number;
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
}

// TODO: we should be able to define customer something like this
// type Customer = Person | Company;
// interface Person {
//   type: 'person';
//   ...
// }

export interface Customer {
  id: number;
  type: CustomerType;
  comment: string;
  email: string;
  hidden: boolean;
  name?: string;
  rate_group_id: number;
  created_at: string;
  updated_at: string;
  persons?: number[];
  tags: number[];
  addresses: Address[];
  company_id?: number | null;
  department?: null;
  first_name?: string;
  last_name?: string;
  salutation?: string;
}

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

export enum CustomerType {
  Company = 'company',
  Person = 'person',
}

//tslint:disable-next-line:no-any ; really don't care for that type, and it comes from deep inside Formik
export type HandleFormikSubmit<Values> = (values: Values, formikBag: FormikBag<any, Values>) => void;

export interface Listing {
  id?: number;
  archived?: boolean;
}

export type DimeDate = string;

//tslint:disable-next-line:no-any ; If we'd type thoroughly we'd need to create a type for each models representation in a form / yup validation schema
export type FormValues = any;
