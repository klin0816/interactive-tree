export function search(mode, base, node, linked = []) {
  if (node[mode] === null) {
    return linked;
  }
  for (const n of node[mode]) {
    linked.push(n);
    search(mode, base, base[n], linked);
  }

  return linked;
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
      const nodeKey = `${layer}-${key}`;
      newBase[nodeKey] = {
        showingName: key,
        parent:
          nodeKey in newBase
            ? newBase[nodeKey]["parent"].includes(parent)
              ? newBase[nodeKey]["parent"]
              : newBase[nodeKey]["parent"].concat([parent])
            : parent === null
            ? null
            : [parent],
        child:
          nodeKey in newBase
            ? newBase[nodeKey]["child"] === []
              ? newBase[nodeKey]["child"]
              : node[key] === null
              ? []
              : newBase[nodeKey]["child"].concat(
                  node[key].map((x) => `${layer + 1}-${Object.keys(x)[0]}`)
                )
            : node[key] === null
            ? null
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

export function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    width: rect.width || el.offsetWidth,
    height: rect.height || el.offsetHeight,
  };
}

export function connect(div1, div2, color, thickness) {
  const off1 = getOffset(div1);
  const off2 = getOffset(div2);

  const x1 = off1.left + off1.width;
  const y1 = off1.top + off1.height / 2;

  const x2 = off2.left;
  const y2 = off2.top + off2.height / 2;

  const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

  const cx = (x1 + x2) / 2 - length / 2;
  const cy = (y1 + y2) / 2 - thickness / 2;

  const angle = Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);

  const line =
    "padding:0px;" +
    "margin:0px;" +
    "height:" +
    thickness +
    "px;" +
    "background-color:" +
    color +
    ";" +
    "line-height:1px;" +
    "position:absolute;" +
    "left:" +
    cx +
    "px;" +
    "top:" +
    cy +
    "px;" +
    "width:" +
    length +
    "px;" +
    "-moz-transform:rotate(" +
    angle +
    "deg);" +
    "-webkit-transform:rotate(" +
    angle +
    "deg);" +
    "-o-transform:rotate(" +
    angle +
    "deg);" +
    "-ms-transform:rotate(" +
    angle +
    "deg);" +
    "transform:rotate(" +
    angle +
    "deg);";

  const child = document.createElement("div");
  child.setAttribute("style", line);

  return child;
}
