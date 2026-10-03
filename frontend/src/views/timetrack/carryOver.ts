// Values to prefill the form with after "save and continue": everything is kept except the comment,
// which would otherwise be duplicated onto the next entry (possibly for a different project).
export function carryOverWithoutComment<T extends object>(entity: T): T {
  return { ...entity, comment: null };
}
