function findKthPositive(arr, k) {
  let missingCount = 0;
  let current = 1;

  let i = 0;
  while (true) {
    if (i < arr.length && arr[i] == current) {
      i++;
    } else {
      missingCount++;
      if (missingCount == k) {
        return current;
      }
    }
    current++;
  }
}
