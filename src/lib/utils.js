export function searchParent(base, node, parents = []) {
  if (node["parent"] === null) {
    return parents;
  }
  parents.push(node["parent"]);
  searchParent(base, base[node["parent"]], parents);

  return parents;
}

export function searchChild(base, node, children = []) {
  if (node["child"] === []) {
    return children;
  }
  for (const child of node["child"]) {
    children.push(child);
    searchChild(base, base[child], children);
  }

  return children;
}

export function restructure(base) {
  let newBase = {};
  let i = 0;
  for (const key of Object.keys(base)) {
    if (!(base[key]["layer"] in newBase)) {
      newBase[base[key]["layer"]] = [];
    }
    newBase[base[key]["layer"]].push(key);
  }
  return newBase;
}

export function load(base, parent = null, layer = 0, newBase = {}) {
  for (const node of base) {
    for (const key of Object.keys(node)) {
      newBase[`${layer}-${key}`] = {
        showingName: key,
        parent: parent,
        child:
          node[key] === null
            ? []
            : node[key].map((x) => `${layer + 1}-${Object.keys(x)[0]}`),
        layer: layer,
      };
      if (!(node[key] === null)) {
        load(node[key], `${layer}-${key}`, layer + 1, newBase);
      }
    }
  }
  return newBase;
}
