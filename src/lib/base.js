export const base = {
  A: {
    parent: null,
    child: ["aa", "bb"],
    layer: 0,
    index: 0,
  },
  bb: {
    parent: "A",
    child: [],
    layer: 1,
    index: 1,
  },
  aa: {
    parent: "A",
    child: ["aaa", "bbb"],
    layer: 1,
    index: 0,
  },
  aaa: {
    parent: "aa",
    child: [],
    layer: 2,
    index: 0,
  },
  bbb: {
    parent: "aa",
    child: [],
    layer: 2,
    index: 1,
  },
};
