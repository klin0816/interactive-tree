<script>
  import yaml from 'js-yaml'
  import { onMount } from 'svelte' 
  import { mock } from './assets/mock'
  import { searchParent, searchChild, restructure, load } from './lib/utils'
  import {
    LAYER_COLOR,
    LINE_COLOR,
    LINE_WIDTH,
  } from './constants/res.js'

  let base = load(yaml.load(mock))
  let lineContainer
  let newBase = restructure(base)

  onMount(async () => {
    for (const block of Object.keys(base)){
      const parentElement = document.getElementById(block)
      for (const child of base[block]["child"]) {
        const childElement = document.getElementById(child)
        connect(parentElement, childElement, LINE_COLOR, LINE_WIDTH)
      }
    }
    for (const node in base) {
      base[node]['selected'] = true
    }
  })

  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.pageXOffset,
      top: rect.top + window.pageYOffset,
      width: rect.width || el.offsetWidth,
      height: rect.height || el.offsetHeight
    };
  }

  function connect(div1, div2, color, thickness) {
    const off1 = getOffset(div1);
    const off2 = getOffset(div2);
  
    const x1 = off1.left+off1.width/2;
    const y1 = off1.top+off1.height;
  
    const x2 = off2.left+off2.width/2;
    const y2 = off2.top;
  
    const length = Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
  
    const cx = ((x1+x2)/2)-(length/2);
    const cy = ((y1+y2)/2)-(thickness/2);
  
    const angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);
  
    const line = "padding:0px;" +
                     "margin:0px;" +
                     "height:" + thickness + "px;" +
                     "background-color:" + color + ";" +
                     "line-height:1px;" +
                     "position:absolute;" +
                     "left:" + cx + "px;" +
                     "top:" + cy + "px;" +
                     "width:" + length + "px;" +
                     "-moz-transform:rotate(" + angle + "deg);" +
                     "-webkit-transform:rotate(" + angle + "deg);" +
                     "-o-transform:rotate(" + angle + "deg);" +
                     "-ms-transform:rotate(" + angle + "deg);" +
                     "transform:rotate(" + angle + "deg);";
  
    const child = document.createElement('div')
    child.style=line
    lineContainer.appendChild(child)
  }

  function blur(id) {
    for (const node in base) {
      base[node]['selected'] = true
    }
    let parents = searchParent(base, base[id])
    let children = searchChild(base, base[id])
    let family = parents.concat(children)
    family.push(id)
    for (const node of Object.keys(base)) {
      if (!(family.includes(node))) {
        base[node]['selected'] = false
      }   
    }
  }
</script>

<template lang="pug">
  div(bind:this='{lineContainer}')
  +each('Object.keys(newBase) as layer')
    .flex.p-1
      +each("newBase[layer] as block")
        .p-1
          .p-2(class="bg-{LAYER_COLOR[layer]}-300 {base[block]['selected'] === true ? 'opacity-100' : 'opacity-40'}",id="{block}",on:click!="{() => blur(block)}") {block}
</template>

<style>
</style>
