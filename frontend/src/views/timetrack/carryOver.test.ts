import { carryOverWithoutComment } from './carryOver';

describe('carryOverWithoutComment', () => {
  const entry = { project_id: 1, position_id: 2, costgroup_number: 3, value: 4, comment: 'Meeting' };

  it('clears the comment', () => {
    expect(carryOverWithoutComment(entry).comment).toBeNull();
  });

  it('keeps all other fields', () => {
    const { comment, ...rest } = carryOverWithoutComment(entry);
    const { comment: _, ...expected } = entry;
    expect(rest).toEqual(expected);
  });

  it('does not mutate the submitted entry', () => {
    carryOverWithoutComment(entry);
    expect(entry.comment).toBe('Meeting');
  });
});
