export interface Service {
  id?: number;
  name: string;
  description: string;
  vat: number;
  chargeable: boolean;
  archived: boolean;
  service_rates: ServiceRate[];
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
