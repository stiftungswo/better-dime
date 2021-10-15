// finds the index at which we should insert an element into an array
// if we want to keep the later as sorted as possible,
// with the following caveats:
//  - The array might not be sorted, so we can't just binary search.
//  - If there are multiple equally good positions, take the last one.

export const getInsertionIndex = <T>(arr: T[], item: T, compareFn: (a: T, b: T) => number) => {
  const itemsCount = arr.length;

  // If one or more array elements are equal to the item,
  // then we want to insert directly after the last one of them.
  // Otherwise, insert at the position which minimizes the resulting number
  // of inversions https://en.wikipedia.org/wiki/Inversion_(discrete_mathematics)

  let curInversions = arr.filter((elem: T) => compareFn(item, elem) > 0).length;
  let bestIndex = 0;
  let bestInversions = curInversions;

  for (let i = 0; i < itemsCount; ++i) {
    const comparison = compareFn(item, arr[i]);

    if (comparison === 0) {
        bestIndex = i + 1;
        bestInversions = -1;
        // don't return yet -- there might be multiples identical elements
        // and we want the last one.
    } else {
        if (comparison < 0) {
            ++curInversions;
        } else {
            --curInversions;
        }
        // <= so we prefer later indices
        if (curInversions <= bestInversions) {
            bestInversions = curInversions;
            bestIndex = i + 1;
        }
    }
  }
  return bestIndex;
};
