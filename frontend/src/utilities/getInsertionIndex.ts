// https://gist.github.com/Izhaki/834a9d37d1ad34c6179b6a16e670b526
// Finds the insertion index for an item in an array.
// Uses compareFn (similar to that provided to array.sort())

const getMidPoint = (start: number, end: number) => Math.floor((end - start) / 2) + start;

export const getInsertionIndex = <T>(arr: T[], item: T, compareFn: (a: T, b: T) => number) => {
  const itemsCount = arr.length;

  // No items in array, so return insertion index 0
  if (itemsCount === 0) {
    return 0;
  }

  const lastItem = arr[itemsCount - 1];

  // In case the item is beyond the end of this array, or
  // identical to the last item.
  // We need this as for arrays with 1 item start and end will be
  // 0 so we never enter the while loop below.
  if (compareFn(item, lastItem) >= 0) {
    return itemsCount;
  }

  let start = 0;
  let end = itemsCount - 1;
  let index = getMidPoint(start, end);

  // Binary search - start in middle, divide and conquer.
  while (start < end) {
    const curItem = arr[index];

    const comparison = compareFn(item, curItem);

    if (comparison === 0) {
      // Indentical item
      break;
    } else if (comparison < 0) {
      // Target is lower in array, move the index halfway down.
      end = index;
    } else {
      // Target is higher in array, move the index halfway up.
      start = index + 1;
    }
    index = getMidPoint(start, end);
  }

  return index;
};
