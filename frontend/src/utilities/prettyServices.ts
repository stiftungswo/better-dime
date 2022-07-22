import { Service, ServiceCategory, ServiceCategoryStub } from '../types';

export function prettyName(e: Service | ServiceCategoryStub | null, isFrench: boolean) {
  // note: Services do not have french names, only categories do.
  // https://stackoverflow.com/questions/58974640/typescript-property-does-not-exist-on-union-type
  return e === null ? '9999 ---' : e.order + ' ' + (isFrench && 'french_name' in e ? e.french_name : e.name);
}
export function prettyList(subCategories: any[], isFrench: boolean) {
  return subCategories.map(e => ({
    value: e.id,
    label: prettyName(e, isFrench),
  }));
}
