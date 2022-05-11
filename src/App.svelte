<script>
import yaml from 'js-yaml'
import { onMount } from 'svelte' 
import { mock } from './assets/mock'
import { data } from './assets/data'
import {
  connect,
  load,
  restructure,
  search,
} from './lib/utils'
import {
  LAYER_COLOR,
  LINE_COLOR,
  LINE_WIDTH,
} from './constants/res.js'

let base = load(yaml.load(data))
let clear = 0
let newBase = restructure(base)
let selected
let lineContainer

onMount(async () => {
  for (const block of Object.keys(base)){
    const parentElement = document.getElementById(block)
    for (const child of base[block]["child"]) {
      const childElement = document.getElementById(child)
      lineContainer.appendChild(connect(parentElement, childElement, LINE_COLOR, LINE_WIDTH))
    }
  }
  for (const node in base) {
    base[node]['selected'] = true
  }
})

function blur(id) {
  if (id === selected) {
    return
  }
  clearBlur()
  selected = id
  clear = 1
  let parents = search("parent", base, base[id])
  let children = search("child", base, base[id])
  let family = parents.concat(children)
  family.push(id)
  for (const node of Object.keys(base)) {
    if (!(family.includes(node))) {
      base[node]['selected'] = false
    }
  }
}

function clearBlur() {
  if (clear === 1) {
    clear = 0
    return
  }
  selected = null
  for (const node in base) {
    base[node]['selected'] = true
  }
}
</script>

<template lang="pug">
.w-screen.h-screen(on:click!="{clearBlur}")
  div(bind:this='{lineContainer}')
  .grid.grid-flow-col.auto-cols-max
    +each('Object.keys(newBase) as layer')
      .flex.flex-col.p-2
        +each("newBase[layer] as block")
          .p-2
            .p-2.w-24(
              class="{base[block]['selected'] === true ? 'opacity-100' : 'opacity-40'}",
              style="background-color: {LAYER_COLOR[layer]}",
              id="{block}",
              on:click!="{() => blur(block)}",
              ) {base[block]["showingName"]}
      
</template>

<style>

</style>
