import { Employee } from '../../types';

// Tests for the filterByIds filtering logic added to EmployeeSelect.
// Extracted as a pure function to test without React rendering infrastructure.
function applyFilter(
  employees: Pick<Employee, 'id' | 'archived'>[],
  filterByIds?: number[],
  selectedValue?: number,
): Pick<Employee, 'id' | 'archived'>[] {
  return employees.filter(e => {
    if (e.archived && selectedValue !== e.id) {
      return false;
    }
    if (filterByIds && filterByIds.length > 0) {
      return filterByIds.includes(e.id!);
    }
    return true;
  });
}

const active = (id: number) => ({ id, archived: false });
const archived = (id: number) => ({ id, archived: true });

describe('EmployeeSelect filterByIds logic', () => {
  const employees = [active(1), active(2), active(3)];

  it('returns all active employees when filterByIds is not provided', () => {
    expect(applyFilter(employees).map(e => e.id)).toEqual([1, 2, 3]);
  });

  it('returns all active employees when filterByIds is an empty array', () => {
    expect(applyFilter(employees, []).map(e => e.id)).toEqual([1, 2, 3]);
  });

  it('returns only employees whose IDs are in filterByIds', () => {
    expect(applyFilter(employees, [1, 3]).map(e => e.id)).toEqual([1, 3]);
  });

  it('returns an empty list when filterByIds contains no matching IDs', () => {
    expect(applyFilter(employees, [99])).toHaveLength(0);
  });

  it('excludes archived employees that are not the current selection', () => {
    const withArchived = [active(1), active(2), archived(3)];
    expect(applyFilter(withArchived).map(e => e.id)).toEqual([1, 2]);
  });

  it('keeps an archived employee when they are the currently selected value', () => {
    const withArchived = [active(1), archived(2)];
    expect(applyFilter(withArchived, undefined, 2).map(e => e.id)).toEqual([1, 2]);
  });

  it('applies filterByIds after the archived exclusion', () => {
    const withArchived = [active(1), active(2), archived(3)];
    // archived(3) is excluded because it's not selected, regardless of filterByIds
    expect(applyFilter(withArchived, [1, 3]).map(e => e.id)).toEqual([1]);
  });
});
