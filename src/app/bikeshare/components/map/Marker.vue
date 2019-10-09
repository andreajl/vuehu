<template>
  <svg width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="11" opacity="0.5" stroke-width="1" stroke="black" :fill="fillColor" />
  </svg>
</template>

<script lang="ts">
export default {
  props: ['fillColor'],
};
</script>
