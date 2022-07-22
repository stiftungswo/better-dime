import { Service, ServiceCategory, ServiceCategoryStub } from '../types';

export function prettyName(e: Service | ServiceCategoryStub | null) {
    return e === null ? '9999 ---' : e.order + ' ' + e.name;
}
export function prettyList(subCategories: any[]) {
  return subCategories.map(e => ({
    value: e.id,
    label: prettyName(e),
  }));
}
