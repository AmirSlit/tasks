var longestCommonPrefix = function (strs) {
  let candidate = strs[0];

  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(candidate)) {
      candidate = candidate.slice(0, -1);
      if (candidate === "") return "";
    }
  }

  return candidate;
};
