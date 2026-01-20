<template>
  <svg :width="width" :height="height" :viewBox="viewBox" xmlns="http://www.w3.org/2000/svg">
    <g v-html="svgContent"></g>
  </svg>
</template>

<script>
import { createTaskSvg } from './taskSvgFactory';

export default {
  name: 'PalettePreview',
  props: {
    typeKey: { type: String, required: true },
    width: { type: Number, default: 56 },
    height: { type: Number, default: 44 }
  },
  computed: {
    viewBox() {
      return `0 0 ${this.width} ${this.height}`;
    },
    svgContent() {
      return createTaskSvg(this.typeKey, this.width, this.height, true);
    }
  }
};
</script>
