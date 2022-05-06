export class TreeNode {
  constructor(data, index=null, parent=null) {
    this.data = data
    this.index = index
    this.parent = parent
    this.child = []
  }
}

export class Tree {
  constructor() {
    this.root = null
  }
}

export function searchParent(base, node, parents=[]) {
  if (node['parent'] === null) {
    return parents
  }
  parents.push(node['parent'])
  searchParent(base, base[node['parent']], parents)

  return parents
}

export function searchChild(base, node, children=[]) {
  if(node['child'] === []) {
    return children
  }
  for (const child of node['child']) {
    children.push(child)
    searchChild(base, base[child], children)
  }

  return children
}

export function restructure(base) {
  let newBase = {}
  for (const key of Object.keys(base)) {
    if (!(base[key]['layer'] in newBase)) {
      newBase[base[key]['layer']] = []
    }
    newBase[base[key]['layer']][key] = base[key]['index']
  }
  for (const key of Object.keys(newBase)) {
    let items = Object.keys(newBase[key]).map(function(k) {
      return [k, newBase[key][k]]
    })
    items.sort(function(first, second) {
      return first[1] - second[1]
    })
    newBase[key] = items.map(function(k) {
      return k[0]
    })
  }
  
  return newBase
}
