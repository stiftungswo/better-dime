// tslint:disable

export interface Offer {
  id?: number;
  accountant_id: number;
  address_id: number;
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
  project_ids: number[];
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
  holidays_per_year: number;
  realTime: number;
  targetTime: number;
  extendTimetrack: boolean;
  workingPeriods: any[];
  password: string;
}

export interface Address {
  id: number;
  street: string;
  city: string;
  plz: number;
  country: string;
  supplement?: string;
}

export interface Customer {
  id: number;
  user: Employee;
  createdAt: string;
  updatedAt: string;
  name: string;
  alias: string;
  tags: any[];
  company: string;
  department: string;
  fullname: string;
  salutation: string;
  rateGroup: CustomerRateGroup;
  chargeable: boolean;
  systemCustomer: boolean;
  address: Address;
  phones: any[];
}

export interface CustomerRateGroup {
  id: number;
  user: Employee;
  createdAt: string;
  updatedAt: string;
  description: string;
  name: RateGroupName;
}

export enum RateGroupName {
  Kanton = 'Kanton',
}

export enum RateUnit {
  CHFH = 'CHF/h',
}

export interface RateUnitType {
  id: ID;
  user: User;
  createdAt: string;
  updatedAt: string;
  name: RateUnitTypeName;
  doTransform: boolean;
  factor: number;
  scale: number;
  roundMode: number;
  symbol: ID;
}

export enum ID {
  H = 'h',
}

export enum RateUnitTypeName {
  Stunden = 'Stunden',
}

export interface User {}

export enum Alias {
  Consulting = 'consulting',
}

export enum ServiceDescription {
  ThisIsADetailedDescription = 'This is a detailed description',
}

export interface ServiceRate {
  id: number;
  user: User;
  createdAt: string;
  updatedAt: string;
  rateGroup: ServiceRateRateGroup;
  rateUnit: RateUnit;
  rateUnitType: RateUnitType;
  service: User;
  rateValue: string;
}

export interface ServiceRateRateGroup {
  id: number;
  user: User;
  createdAt: string;
  updatedAt: string;
  description: string;
  name: RateGroupName;
}

export interface Project {
  id: number;
  createdAt: string;
  updatedAt: string;
  currentPrice: string;
  remainingBudgetPrice: string;
  currentTime: string;
  remainingBudgetTime: string;
  budgetTime: string;
  budgetPrice: string;
  name: string;
  alias: string;
  startedAt: string;
  stoppedAt: string;
  description: string;
  tags: any[];
  chargeable: boolean;
  activities: any[];
  invoices: any[];
  comments: any[];
  offers: any[];
  archived: boolean;
}

export interface Status {
  id: number;
  createdAt: string;
  updatedAt: string;
  text: string;
  active: boolean;
}
